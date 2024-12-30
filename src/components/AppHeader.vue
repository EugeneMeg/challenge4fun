<script setup lang="ts">
    import IconLogo from '@/assets/icons/logo.svg';
</script>

<template>
    <header class="header">
        <div class="container">
            <div class="header__in">
                <div class="header__column">
                    <div class="header__item">
                        <router-link class="link link--logo" :to="{ name: 'home' }">
                            <IconLogo width="32" height="32"></IconLogo>

                            <div class="header__logo-text">
                                Challenge<span class="header__logo-substr">4</span>Fun
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
