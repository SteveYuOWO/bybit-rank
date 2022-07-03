<script setup lang="ts">
import axios from 'axios';
import { reactive, Ref, ref, watch, watchEffect } from 'vue';
import Big from 'big.js';

interface TeamInfo {
  rank: number;
  squad_name: string;
  region: string;
  join_count: number;
  profit_ratio_e6: string;
  profit_e8: string;
  award: number;
  team_icon: string;
  team_id: string;
  is_award_valid: boolean;
}

const teamsInfoGlobal: Ref<TeamInfo[]> = ref([])
const teamsInfoAsia: Ref<TeamInfo[]> = ref([])

axios.get('https://muser.work/s1/wsot2022/squad/rank').then(response => teamsInfoGlobal.value = response.data.result.team_profit_ratio.teams)

const teamsTableHeader: string[] = [
  "排名",
  "戰隊",
  "賽區",
  "成員數量",
  "盈利率",
  "獎勵(USDT)"
]

const rank = ref({
  globalRank: 0,
  asiaRank: 0,
})

watchEffect(() => {
  teamsInfoAsia.value = teamsInfoGlobal.value.filter(teamInfo => teamInfo.region === 'CN');
  const asiaRank = teamsInfoAsia.value.findIndex(teamInfo => teamInfo.squad_name === '王不愛的戰隊');
  const globalRank = teamsInfoGlobal.value.find(teamInfo => teamInfo.squad_name === '王不愛的戰隊')?.rank ?? 0;
  rank.value = {
    globalRank,
    asiaRank: asiaRank === -1 ? 0 : asiaRank,
  };
})

</script>

<template>
  <div class="text-2xl font-semibold mb-8 flex justify-center items-center">
    <div class="mr-8">全球排行: {{rank.globalRank}}</div>
    <div>華語區排行: {{rank.asiaRank}}</div>
  </div>

  <h2 class="text-4xl font-bold mb-4">華語區數據</h2>
  <table class="m-auto mb-8">
    <thead>
      <th v-for="(headerCeil) in teamsTableHeader">
        <td class="grid place-items-center">{{ headerCeil }}</td>
      </th>
    </thead>
    <tbody v-for="(teamInfo, idx) in teamsInfoAsia">
      <tr :class="{'bg-sky-300': teamInfo.squad_name === '王不愛的戰隊'}" class="h-full">
        <td>{{ idx + 1 }}</td>
        <td class="flex justify-start items-center min-w-[250px] px-10">
          <div class="rounded-full overflow-hidden m-4">
            <img :src="teamInfo.team_icon" width="50" height="50" loading="lazy"/>
          </div>
          <p>{{ teamInfo.squad_name }}</p>
        </td>
        <td>{{ teamInfo.region }}</td>
        <td>{{ teamInfo.join_count }}</td>
        <td>{{ Big(teamInfo.profit_ratio_e6).div(10 ** 4).toFixed(2) }}%</td>
        <td>{{ teamInfo.award }}</td>
      </tr>
    </tbody>
  </table>
  

  <h2 class="text-4xl font-bold mb-4">全球數據</h2>
  <table class="ml-auto mr-auto">
    <thead>
      <th v-for="(headerCeil) in teamsTableHeader">
        <td class="grid place-items-center">{{ headerCeil }}</td>
      </th>
    </thead>
    <tbody v-for="(teamInfo, idx) in teamsInfoGlobal">
      <tr :class="{'bg-sky-300': teamInfo.squad_name === '王不愛的戰隊'}" class="h-full">
        <td>{{ idx + 1 }}</td>
        <td class="flex justify-start items-center min-w-[250px] px-10">
          <div class="rounded-full overflow-hidden m-4">
            <img :src="teamInfo.team_icon" width="50" height="50" loading="lazy" />
          </div>
          <p>{{ teamInfo.squad_name }}</p>
        </td>
        <td>{{ teamInfo.region }}</td>
        <td>{{ teamInfo.join_count }}</td>
        <td>{{ Big(teamInfo.profit_ratio_e6).div(10 ** 4).toFixed(2) }}%</td>
        <td>{{ teamInfo.award }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background: rgb(255, 179, 151);
}
</style>
