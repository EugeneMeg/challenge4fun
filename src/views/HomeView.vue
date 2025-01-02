<template>
    <main>
        <div class="presentation">
            <div class="container container--8">
                <div class="page-block">
                    <div class="presentation__in">
                        <div class="presentation__activities">
                            <div ccclass="presentation__activity">
                                <div class="title-h1">
                                    Death Match
                                </div>
                            </div>

                            <router-link :to="{ name: 'death_match_squat' }" class="link presentation__link">
                                <div class="text-t1 presentation__activity-item">
                                    Squat
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
