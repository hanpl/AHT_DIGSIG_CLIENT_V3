<template>
    <div class="main auto" >
        <video 
            class="main1" ref="videoPlayer" 
            :autoplay="ispause" muted :src="currentVideoSrc()" 
            @ended="handleVideoEnd"
            @error="handleVideoError()"
        ></video>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    propsValue: {
        type: Array as PropType<Array<{
            liveAuto: string,
            live: string,
            iata: string,
            city: string,
            listVideoGate: Array<{
              videoName: string;
            }>
        }>>,
    },
});
const { propsValue  } = props;
const ispause = ref(true);
const defaultVideoSrc = ref("Manual/AHTBG.mp4");
const currentVideoIndex = ref(0);
const videos = ref([""]);
const currentVideoSrc = () => {
    const originalSrc = `/sources/`+videos.value[currentVideoIndex.value];
    return `${originalSrc}?timestamp=${new Date().getTime()}`;
};
const handleVideoEnd = () => {
     if (currentVideoIndex.value < videos.value.length - 1) {
                currentVideoIndex.value++;
            } else {
                currentVideoIndex.value = 0;
            }
};
const handleVideoError = () => {
    // videos.value[currentVideoIndex.value] = videos.value[0];
    currentVideoIndex.value++;
            if (currentVideoIndex.value >= videos.value.length) {
                currentVideoIndex.value = 0; // Quay lại video đầu tiên hoặc dừng
            }
};

watch(() => props.propsValue, () => {
    if (props.propsValue && props.propsValue.length > 0) {
        ispause.value = false;
        currentVideoIndex.value = 0;
        videos.value=[];
        if(props.propsValue[0].live != 'AHT')
        {
            videos.value.push(props.propsValue[0].iata+`/`+props.propsValue[0].live+`.mp4`);
            videos.value.push('CityTo/'+props.propsValue[0].city+'.mp4');
        }
        else
        {
            videos.value.push('CityTo/'+props.propsValue[0].city+'.mp4');
        }
        ispause.value = true;
    }
});

onMounted(() => {
    if (props.propsValue && props.propsValue.length > 0) {
        ispause.value = false;
        currentVideoIndex.value = 0;
        videos.value=[];
        if(props.propsValue[0].live != 'AHT')
        {
            videos.value.push(props.propsValue[0].iata+`/`+props.propsValue[0].live+`.mp4`);
            videos.value.push('CityTo/'+props.propsValue[0].city+'.mp4');
        }
        else
        {
            videos.value.push('CityTo/'+props.propsValue[0].city+'.mp4');
        }
        ispause.value = true;
    }

});
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
.hiden {
    display: none;
}
.hiden2 {
    display: none;
}
.main1 {
    width: 100%;
}
</style>
