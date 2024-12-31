<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import  * as posenet from '@tensorflow-models/posenet';

    const canvas = ref(null);
    const video = ref(null);
    const ctx = ref(null);

    const constraints = ref({
        audio: false,
        video: true,
    });

    onMounted(async () => {
        if (video.value && canvas.value) {
            ctx.value = canvas.value.getContext('2d');

            await navigator.mediaDevices
                .getUserMedia(constraints.value)
                .then(SetStream)
                .catch(e => {
                    console.error(e);
                })
        }
    });

    function SetStream(stream) {
        video.value.srcObject = stream;
        video.value.play();

        requestAnimationFrame(Draw);
    };

    function Draw() {
        if (canvas.value) {
            ctx.value.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
        }

        requestAnimationFrame(Draw);
    };

    // Load posenet
    const runPosenet = async () => {
        const net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: {
                width: 640,
                height: 480,
            },
            multiplier: 1.0,
        });

        setInterval(() => {
            detect(net);
        }, 100);
    };

    const detect = async (net) => {
        // Get Video Properties
        const currentVideo = video.value;
        const videoWidth = video.value.videoWidth;
        const videoHeight = video.value.videoHeight;

        // Set video width
        video.value.width = videoWidth;
        video.value.height = videoHeight;

        const pose = await net.estimateSinglePose(currentVideo);
        console.log(pose);
    };

    runPosenet();
</script>

<template>
    <div class="camera">
        <video ref="video" autoplay playsinline webkit-playsinline muted hidden></video>

        <canvas ref="canvas" width="640" height="480" class="camera__canvas"></canvas>
    </div>
</template>
