<template>
    <div class="main auto" >
        <video 
            :key="videoKey"
            class="main1" ref="videoPlayer" 
            :autoplay="ispause" muted :src="currentVideoSrc()" 
            @error="handleVideoError()"
            :loop = "true"
        ></video>
    </div>
    <!-- controls -->
</template>

<script setup lang="ts">
const videoKey = ref("",)
const ispause = ref(true);
const urlSrc =ref("");
const abcCurrent =ref("");
const urlSrcTemp =ref();
const defaultVideoSrc = ref("Manual/AHTBG.mp4");
const intervalId = ref<NodeJS.Timeout | null>(null);

const props = defineProps<{
  propsValueNow: FlightInfo;
}>();

const localValue = ref(props.propsValueNow);

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


const currentVideoSrc = () => {
  
    const originalSrc = `/sources/`+ urlSrc.value;
    console.log("Chami:", localValue.value.auto);
    if(localValue.value.auto == "False"){
           return `/sources/Manual/AHTBG.mp4?timestamp=${new Date().getTime()}`;
    }
    else
    {
          return `${originalSrc}?timestamp=${new Date().getTime()}`;
    }

    
};
watch(() => props.propsValueNow, (newVal) => {
    stopInterval();
    urlSrcTemp.value = (newVal.iata+"_") + (newVal.mode == 'No'?'NOEGATE':'EGATE') +"_"+((newVal.remark == 'On time' || newVal.remark == 'Delayed')?'PRE':'BOARD') + "_" + newVal.leftRight ;
    //VN_EGATE_PRE_LEFT.mp4
    if (isNowInRange(newVal.timeMcdt)) 
    {
        console.log("✅ Gate On time!");
        urlSrc.value = newVal ? (newVal.live != 'AHT' ? newVal.iata+`/`+urlSrcTemp.value+`.mp4` : `Manual/AHTBG.mp4`):`Manual/AHTBG.mp4`;
    } 
    else 
    {
        console.log("❌ Gate Time out!");
        abcCurrent.value = newVal ? (newVal.live != 'AHT' ? newVal.iata+`/`+urlSrcTemp.value+`.mp4` : `Manual/AHTBG.mp4`):`Manual/AHTBG.mp4`;
        urlSrc.value = `Manual/AHTBG.mp4`;
        startInterval(newVal.timeMcdt);
    }
    console.log("✳️ Prop changed in child:", urlSrc.value);
    localValue.value = newVal; 
    }, { immediate: true });


function startInterval(time: string) {
        intervalId.value = setInterval(() => CheckTime(time), 120000);
};
function stopInterval() {
  if (typeof intervalId !== 'undefined' && intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

const CheckTime = (timeMcdt: string) => {
  console.log("Check Time Gate!");
  if (isNowInRange(timeMcdt)) 
  {
    urlSrc.value = abcCurrent.value;
    stopInterval();
  } 
}

function isNowInRange(timeMcdt: string): boolean {
  const flightTime = new Date(timeMcdt);
  if (isNaN(flightTime.getTime())) 
  {
     console.error("❌ timeMcdt không hợp lệ:", flightTime);
     return false;
  }
  const now = new Date();
  const minTime = new Date(flightTime.getTime() - 150 * 60 * 1000); // -150 phút
  const maxTime = new Date(flightTime.getTime() + 20 * 60 * 1000);  // +20 phút
  return now >= minTime && now <= maxTime;
}


const emit = defineEmits(['video-ended']);

const handleVideoError = () => {

    urlSrc.value = defaultVideoSrc.value;
    console.log("handleVideoError"); 
    
};




</script>

<style>
body {
    margin: 0px !important;
}
.main {
    max-height: 100vh;
    height: auto;
    overflow: hidden;
}
.main1 {
    width: 100%;
}

</style>