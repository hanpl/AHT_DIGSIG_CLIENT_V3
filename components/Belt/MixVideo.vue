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
            listVideoGate: Array<{
              videoName: string;
            }>
        }>>,
    },
});
const { propsValue  } = props;
const ispause = ref(true);
const defaultVideoSrc = ref("AHTBG.mp4");
const currentVideoIndex = ref(0);
const videos = ref([""]);
const currentVideoSrc = () => {
    const originalSrc = `/sources/Manual/`+encodeURIComponent(videos.value[currentVideoIndex.value]);
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
    //console.log(videos.value[currentVideoIndex.value]);
    videos.value[currentVideoIndex.value] = defaultVideoSrc.value;
};

watch(() => props.propsValue, () => {
    if (props.propsValue && props.propsValue.length > 0) {
        ispause.value = false;
        currentVideoIndex.value = 0;
        videos.value=[];
        if(props.propsValue[0].listVideoGate.length>0)
        {
            for(let i=0; i <props.propsValue[0].listVideoGate.length; i++)
            {
                videos.value.push(props.propsValue[0].listVideoGate[i].videoName);
            }
        }
        else 
        {
            videos.value.push("AHTBG.mp4");
        }
        ispause.value = true;
    }
});
onMounted(() => {
    if (props.propsValue && props.propsValue.length > 0) {
        ispause.value = false;
        currentVideoIndex.value = 0;
        videos.value=[];
        if(props.propsValue[0].listVideoGate.length>0)
        {
            for(let i=0; i <props.propsValue[0].listVideoGate.length; i++)
            {
                console.log(props.propsValue[0].listVideoGate[i].videoName);
                videos.value.push(props.propsValue[0].listVideoGate[i].videoName);
            }
        }
        else 
        {
            videos.value.push("Manual/AHTBG.mp4");
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
