<template>
 <!-- <LazyModalManualVideo v-if="manualVideo" :propsValue="propsValue" />  -->

<LazyModalOnlyAirline v-if="onlyAirline" :propsValueNow="propsValue1" @video-ended="handleConfirmation" />
 <!-- <LazyModalMixVideos v-if="mixVideos" :propsValue="propsValue" /> 
 <LazyModalAirlineMixCity v-if="airlineMixCity" :propsValue="propsValue" />
 <LazyModalAirlineMixcityAndMore v-if="airlineMixcityAndMore" :propsValue="propsValue" /> -->
</template>
<script setup lang="ts">
import * as signalR from "@microsoft/signalr";

import { useRoute } from 'vue-router';
const route = useRoute();
const location = ref("");
const name = ref("");
const intervalId = ref<NodeJS.Timeout | null>(null);
const intervalId1 = ref<NodeJS.Timeout | null>(null);
const intervalId2 = ref<NodeJS.Timeout | null>(null);
const manualVideo = ref(false);
const onlyAirline = ref(false);
const mixVideos = ref(false);
const airlineMixCity =ref(false);
const airlineMixcityAndMore = ref(false);
const propsValuePre = ref([{
    name:"",
    iata:"",
    live:""}
]);
const propsValue1 = ref<FlightInfo>({
    auto: "",
    city: "",
    connectionId: "",
    gateChange: "",
    iata: "",
    id: "",
    idFlight: "",
    ip: "",
    leftRight: "",
    live: "",
    liveAuto: "",
    location: "",
    mixCity: "",
    mixVideos: "",
    mode: "",
    name: "",
    nameLineCode: "",
    remark: "",
    status: "",
    timeMcdt: "",
    work: "",
});
interface FlightInfo {
  auto: string;
    city: string;
    connectionId: string;
    gateChange: string;
    iata: string;
    id: string;
    idFlight: string;
    ip: string;
    leftRight: string;
    live: string;
    liveAuto: string;
    location: string;
    mixCity: string;
    mixVideos: string;
    mode: string;
    name: string;
    nameLineCode: string;
    remark: string;
    status: string;
    timeMcdt: string;
    work: string;
}
const nameCounter = ref<string | null>(null);
let timeClose = ref<Date | null>(null);
let timeStart = ref<Date | null>(null);


//const urlHub = 'https://localhost:7248/dashboardHub';
const urlHub = 'http://172.17.18.12:8283/dashboardHub';
const hubConnection = ref<signalR.HubConnection | null>(null);
const connectHub = async () => {
  const url = urlHub;
  hubConnection.value = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(signalR.LogLevel.Information)
      .build();
      receiverUpdate();
    try {
      await hubConnection.value.start();
      console.log(`SignalR connection established `+ nameCounter.value);
      
    } catch (err) {
      console.error('SignalR Connection failed to start:', err);
      startInterval();
    }
  hubConnection.value.onclose(() => {
      console.log('Connection closed');
      startInterval();
    });
};

const reconnectHub = async () => {
  try {
    await hubConnection.value?.start();
    console.log("SignalR reconnection established");
    receiverUpdate();
    stopInterval();
  } catch (err) {
    console.error("SignalR reconnection failed:", err);
  }
};

function startInterval() {
    intervalId.value = setInterval(reconnectHub, 40000);
};
function stopInterval() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

function startInterval1(mcdt:string) {
    const inputTime = new Date(mcdt);
    intervalId1.value = setInterval(() => compareTime(inputTime), 60000);
};
function stopInterval1() {
  if (intervalId1.value) {
    clearInterval(intervalId1.value);
    intervalId1.value = null;
  }
};


function handleConfirmation(){
    //console.log('Confirmation received: END');
};

let isReceiverRegistered = false;
const receiverUpdate = () => {
  if (hubConnection.value && !isReceiverRegistered) {
    hubConnection.value.on("SendToClient", (data: any) => {
      console.log("Received flight update from server:", data);
      // bạn có thể xử lý dữ liệu tại đây nếu muốn render ngay
      console.log(data.auto);
      if(data != null){
                propsValue1.value = data;
                switch (data.work) 
                    {
                        case '2':
                            resetModals();
                            airlineMixCity.value = true;
                            break;
                        case '3':
                            resetModals();
                            mixVideos.value = true;
                            break;
                        case '4':
                            resetModals();
                            airlineMixcityAndMore.value = true;
                            break;
                        default:
                            resetModals();
                            console.log("data[0].work != 234");
                            onlyAirline.value = true;
                    }
            }
            propsValuePre.value = data;
            console.log("Time reload: " + Date());
    });
    isReceiverRegistered = true;
  }
};

onMounted(async () => {
  if (intervalId.value !== null) {
      clearInterval(intervalId.value);
      intervalId.value = null;
  }
  await connectHub();
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  if (intervalId1.value) {
    clearInterval(intervalId1.value);
  }
  if (intervalId2.value) {
    clearInterval(intervalId2.value);
  }
});


function compareTime(mcdt: Date) {
  const currentTime = new Date();
  const threshold = new Date(currentTime.getTime() + 20 * 60000); // -20 phút

  if (mcdt < threshold) {
    console.log("⏰ Hết thời gian hiển thị, gọi lại API.");
    stopInterval1(); // dọn dẹp timer
  }
}




function resetModals() {
  manualVideo.value = false;
  onlyAirline.value = false;
  mixVideos.value = false;
  airlineMixCity.value = false;
  airlineMixcityAndMore.value = false;
}
</script>

<style>

</style>