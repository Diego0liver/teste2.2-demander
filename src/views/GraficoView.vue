<template>
  <div>
    <apexchart type="treemap" :options="chartOptions" :series="seriesData" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexchart: ApexCharts
  },
  setup() {
    const seriesData = ref([]);
    const chartOptions = ref({
      legend: {
        show: false
      },
      chart: {
        height: 350,
        type: 'treemap'
      },
      title: {
        text: `IBM mensal do ano de 2022, 2023 e 2024`
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
      }  
    });
    //Consulta na API açoes mensal do IBM do ano de 2022, 2023 e 2024
    //Obs: a API permite algumas requisições por dia por ser plano gratis
    const fetchData = async () => {
      const keyApi = 'VRGKGVH9HZRC94D7';
      //const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=${keyApi}`;

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'request'
          }
        });

        if (!response.ok) {
          throw new Error('Algo deu errado');
        }

        const data = await response.json();
        const dadosPorMesDaAPI = data['Monthly Time Series'];
        const anosDosDados = ['2022', '2023', '2024'];

        const res = Object.entries(dadosPorMesDaAPI)
          .filter(([date]) => anosDosDados.includes(date.slice(0, 4)))
          .map(([date, values]) => ({
            x: date,
            y: parseFloat(values['1. open'])
          }));

        seriesData.value = [{
          data: res
        }];
      } catch (error) {
        console.error('Error:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      seriesData,
      chartOptions
    };
  }
};
</script>

