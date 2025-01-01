<script lang="ts">
    import { ref, defineComponent } from 'vue';
    import  * as posenet from '@tensorflow-models/posenet';
    import { drawSkeleton, drawKeypoints } from '@/services/utils';

    const ctx = ref(null);

    const constraints = ref({
        audio: false,
        video: true,
    });

    export default defineComponent({
        mounted() {
            this.onMounted();
        },
        methods: {
            async onMounted() {
                if (this.$refs.video && this.$refs.canvas) {
                    ctx.value = this.$refs.canvas.getContext('2d');

                    await navigator.mediaDevices
                        .getUserMedia(constraints.value)
                        .then(this.setStream)
                        .catch(e => {
                            console.error(e);
                        })

                    this.runPosenet();
                }
            },

            setStream(stream) {
                if (this.$refs.video) {
                    this.$refs.video.srcObject = stream;
                    this.$refs.video.play();

                    requestAnimationFrame(this.draw);
                }
            },

            draw() {
                if (this.$refs.video && this.$refs.canvas) {
                    ctx.value.drawImage(this.$refs.video, 0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
                }

                requestAnimationFrame(this.draw);
            },

            async runPosenet() {
                const net = await posenet.load();

                setInterval(() => {
                    this.detect(net);
                }, 100);
            },

            async detect(net) {
                const pose = await net.estimateSinglePose(this.$refs.canvas);

                this.drawCanvas(pose);
            },

            drawCanvas(pose) {
                const ctxs = this.$refs.canvasPosenet.getContext("2d");
                this.$refs.canvasPosenet.width = 640;
                this.$refs.canvasPosenet.height = 480;

                drawKeypoints(pose["keypoints"], 0.6, ctxs);
                drawSkeleton(pose["keypoints"], 0.7, ctxs);
            },
        },
    });
</script>

<template>
    <div class="camera">
        <video ref="video" autoplay playsinline webkit-playsinline muted hidden></video>

        <canvas ref="canvas" width="640" height="480" class="camera__canvas"></canvas>
        <canvas ref="canvasPosenet" width="640" height="480" class="camera__canvas camera__canvas--posenet"></canvas>
    </div>
</template>
