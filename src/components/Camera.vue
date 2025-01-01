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
                // Get Video Properties
                const video = this.$refs.video;
                const videoWidth = this.$refs.video.videoWidth;
                const videoHeight = this.$refs.video.videoHeight;

                // Set video width
                this.$refs.video.width = videoWidth;
                this.$refs.video.height = videoHeight;

                const pose = await net.estimateSinglePose(this.$refs.video);

                drawKeypoints(pose["keypoints"], 0.6, ctx.value);
                drawSkeleton(pose["keypoints"], 0.7, ctx.value);

                console.log(pose);
            },
        },
    });
</script>

<template>
    <div class="camera">
        <video ref="video" autoplay playsinline webkit-playsinline muted hidden></video>

        <canvas ref="canvas" width="640" height="480" class="camera__canvas"></canvas>
    </div>
</template>
