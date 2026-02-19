<template>
  <div
    ref="select"
    tabindex="2"
    class="custom-multiselect-block border-gray-200 border"
  >
    <div class="custom-multiselect__select"></div>
  </div>
</template>
<script setup lang="ts"></script>
<!--flex justify-center dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border rounded-md text-gray-500 dark:text-gray-400-->
<style>
.custom-multiselect-block {
  display: block;
  position: relative;
  width: 100%;
  min-height: 40px;
  height: 100%;
  padding: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  vertical-align: middle;
  border-radius: 0.375rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.custom-multiselect-block .custom-multiselect__select {
  position: absolute;
  width: 40px;
  height: 38px;
  right: 1px;
  top: 1px;
  padding: 4px 8px;
  text-align: center;
  transition: transform 0.2s ease;
  box-sizing: border-box;
  display: block;
  margin: 0;
  text-decoration: none;
  cursor: pointer;
}

.multiselect--active .multiselect__select {
  transform: rotate(180deg);
}
</style>
