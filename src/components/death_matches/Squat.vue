<script lang="ts">
    import { ref, defineComponent } from 'vue';
    import  * as posenet from '@tensorflow-models/posenet';
    import { drawSkeleton, drawKeypoints } from '@/services/utils';

    const ctx = ref(null);

    export default defineComponent({
        data: () => ({
            squatCount: 0,
            squatState: "standing",
        }),
        mounted() {
            this.onMounted();
        },
        methods: {
            async onMounted() {
                if (this.$refs.video && this.$refs.canvas) {
                    ctx.value = this.$refs.canvas.getContext('2d');

                    await navigator.mediaDevices
                        .getUserMedia({
                            audio: false,
                            video: true,
                        })
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

                this.analyzePose(pose);

                this.drawCanvas(pose);
            },

            drawCanvas(pose) {
                const current_ctx = this.$refs.canvasPosenet.getContext('2d');

                this.$refs.canvasPosenet.width = 640;
                this.$refs.canvasPosenet.height = 480;

                drawKeypoints(pose['keypoints'], 0.6, current_ctx);
                drawSkeleton(pose['keypoints'], 0.7, current_ctx);
            },

            analyzePose(pose) {
                const leftHip = pose.keypoints.find((kp) => kp.part === 'leftHip');
                const leftKnee = pose.keypoints.find((kp) => kp.part === 'leftKnee');
                const leftAnkle = pose.keypoints.find((kp) => kp.part === 'leftAnkle');

                if (
                    leftHip.score > 0.5 &&
                    leftKnee.score > 0.5 &&
                    leftAnkle.score > 0.5
                ) {
                    const angle = this.calculateAngle(
                        leftHip.position,
                        leftKnee.position,
                        leftAnkle.position
                    );

                    if (angle <= 90 && this.squatState === 'standing') {
                        this.squatState = 'squat';
                    } else if (angle > 150 && this.squatState === 'squat') {
                        this.squatState = 'standing';
                        this.squatCount++;
                    }
                }
            },

            calculateAngle(a, b, c) {
                const radians = Math.atan2(c.y - b.y, c.x - b.x) -
                    Math.atan2(a.y - b.y, a.x - b.x);
                let angle = Math.abs((radians * 180) / Math.PI);

                if (angle > 180) {
                    angle = 360 - angle;
                }

                return angle;
            },
        },
    });
</script>

<template>
    <div class="camera">
        <video ref="video" autoplay playsinline muted hidden></video>

        <canvas ref="canvas" width="640" height="480" class="camera__canvas"></canvas>
        <canvas ref="canvasPosenet" width="640" height="480" class="camera__canvas camera__canvas--posenet"></canvas>

        <div class="title-h3" v-text="squatState"></div>
        <div class="title-h3" v-text="squatCount"></div>
    </div>
</template>
