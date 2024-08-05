<template>
    <div>
      <apexchart type="treemap" :options="chartOptions" :series="seriesData" @click="click"/>

    <!-- Modal para editar valores -->
    <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 style="color: black;" class="modal-title" id="modalLabel">Editar valor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editarValor(selectedData.id)">
              <div>
                <p style="color: black;">Editar valor do {{ selectedData.x }}</p>
                <input v-model="form.valor" name="valor" class="form-control" required type="text" />
                <input v-model="form.titulo" name="titulo" type="hidden" />
                <input v-model="form.selectedId" name="valorID" type="hidden" />
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary"  data-bs-dismiss="modal">Salvar</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Voltar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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
          type: 'treemap',
        },
        title: {
          text: `API internet`
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
        }  
      });
      
      const form = ref({
        valor: 0,
        titulo: '',
        selectedId: ''
      });

      const selectedData = ref({
        x: '',
        y: 0
      });

    // Carregar todos os dados da API no grafico
    const fetchData = async () => { 
      try {
        const response = await fetch("http://localhost:3000/grafico", {
          headers: {
            'User-Agent': 'request'
          }
        });

        const data = await response.json();
        //console.log(data)
        const res = data.map(item => ({
          x: item.titulo,
          y: item.valor,
          id: item.id
        }));
        seriesData.value = [{
          data: res
        }];
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    //Editar valores do grafico pelo ID
    const editarValor = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/grafico/${id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ valor: parseInt(form.value.valor), titulo: form.value.titulo })
        });

        const result = await response.json();
        //console.log('Resposta:', result);

        //Atualizar grafico
        await fetchData();
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    //Pegar ID por click no grafico 
    const click = (event, chartContext, config) => {
      const { dataPointIndex, seriesIndex } = config;
      const data = seriesData.value[seriesIndex].data[dataPointIndex];
      selectedData.value = data;
      form.value.valor = data.y;
      form.value.titulo = data.x;
      form.value.selectedId = data.id;
      console.log('Selected ID:', data.id);

      // Abrir modal bootstrap
      const modal = new bootstrap.Modal(document.getElementById('modal'));
      modal.show(); 
    };

      onMounted(() => {
        fetchData();
      });
    
      return {
        seriesData,
        chartOptions,
        click,
        form,
        editarValor,
        selectedData
      };
    },
  };
  </script>
  
  