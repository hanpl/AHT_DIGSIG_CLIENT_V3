<template>
    <div class="main auto" >
        <video 
            class="main1" ref="videoPlayer" 
            :autoplay="ispause" muted :src="currentVideoSrc()" 
            @error="handleVideoError()"
            :loop = "true"
        ></video>
    </div>
</template>

<script setup lang="ts">
const ispause = ref(true);
const abc =ref("");
const defaultVideoSrc = ref("AHTBG.mp4");
const props = defineProps({
    propsValue: {
        type: Array as PropType<Array<{
            liveAuto: string,

        }>>,
    },
});
const { propsValue  } = props;

abc.value = props.propsValue && props.propsValue.length > 0 ? (props.propsValue[0].liveAuto != '' ? props.propsValue[0].liveAuto : `AHTBG.mp4`):`AHTBG.mp4`;
console.log(abc.value);
const currentVideoSrc = () => {
    const originalSrc = `/sources/Manual/`+abc.value;
    return `${originalSrc}?timestamp=${new Date().getTime()}`;
};
watch(() => props.propsValue, () => {
    abc.value = props.propsValue && props.propsValue.length > 0 ? (props.propsValue[0].liveAuto != '' ? props.propsValue[0].liveAuto : `AHTBG.mp4`):`AHTBG.mp4`;
});
const handleVideoError = () => {
    console.log(abc);
    if (props.propsValue && props.propsValue.length > 0) {
        abc.value = defaultVideoSrc.value;
    }
    
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