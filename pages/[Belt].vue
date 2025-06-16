<template>
    <LazyBeltMixVideo v-if="mixvideo" :propsValue="propsValue" /> 
    <LazyBeltManual v-if="manual" :propsValue="propsValue" /> 
</template>
   <script setup lang="ts">
   import * as signalR from "@microsoft/signalr";
   
   import { useRoute } from 'vue-router';
   const route = useRoute();
   const location = ref("");
   const intervalId = ref<NodeJS.Timeout | null>(null);
   const intervalId1 = ref<NodeJS.Timeout | null>(null);
   const mixvideo = ref(false);
   const manual = ref(false);
   const propsValue = ref([]);
   const hubConnection = new signalR.HubConnectionBuilder()
               .withUrl('http://172.17.18.12:8281/dashboardHub')
               //.withUrl('https://localhost:7248/dashboardHub')
               .configureLogging(signalR.LogLevel.Information).build();
   onMounted(() => {
       startInterval1();
       location.value = route.params.Belt as string;
       hubConnection.start().then(() => {
           console.log("SignalR connection");
           reload();
           loadModeAuto();
           fetchData();
           }).catch(err => console.error("Signalr Connection failed start:", err));
       hubConnection.onclose(() => {
           console.log("Connection closed");
           stopInterval1();
           startInterval();
       });
   });
   function incrementCount() {
       fetchData();
   }
   function reconnectHub() {
       console.log(Date());
       hubConnection.start().then(() => {
       console.log("SignalR reconnection");
       stopInterval();
       startInterval1();
       reload();
       loadModeAuto();
       
       }).catch(err => console.error("Signalr ReConnection failed start:", err));
   };
   function startInterval() {
       intervalId.value = setInterval(reconnectHub, 40000);
   };
   function startInterval1() {
       intervalId1.value = setInterval(incrementCount, 300000);
   };
   
   function stopInterval() {
     if (intervalId.value) {
       clearInterval(intervalId.value);
       intervalId.value = null;
     }
   };
   function stopInterval1() {
     if (intervalId1.value) {
       clearInterval(intervalId1.value);
       intervalId1.value = null;
     }
   };
   function loadModeAuto(){
       hubConnection.on("ReceivedLoadModeAuto", (connect, message) => {
       console.log(connect+"---"+message);
       fetchData();
       }); 
   };
   
   
   onUnmounted(() => {
     if (intervalId.value) {
       clearInterval(intervalId.value);
     }
     if (intervalId1.value) {
       clearInterval(intervalId1.value);
     }
   });
   
   function reload(){
       hubConnection.on("ReceivedClientChanged", (connect, message) => {
       console.log(connect+message);
       fetchData();
       }); 
   };
   
   
   
   function fetchData(){
               const leftright = location.value;               
               const headers = new Headers();
               headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
               headers.append('Pragma', 'no-cache');
               headers.append('Expires', '0');
               const url = `http://172.17.18.12:8085/api/Belt/${leftright}`;
               //const url = `https://localhost:7079/api/Belt/${leftright}`;
               fetch(url)
               .then(response => response.json())
               .then(data  => {
                   if(data.length>0){
                       propsValue.value = data;
                       if(data[0].auto == "Yes")
                       {
                           mixvideo.value = false; manual.value = false;
                           manual.value = true;
                       }
                       else 
                       {
                           mixvideo.value = false; manual.value = false;
                           mixvideo.value = true;
                       }
                   }
                   })
               .catch(error => {
                   console.error(error);
               });
           }
   </script>