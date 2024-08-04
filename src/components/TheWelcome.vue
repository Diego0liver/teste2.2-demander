<script>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
export default{
  components: {
    WelcomeItem,
    DocumentationIcon,
    ToolingIcon
  },
  data(){
    return {
      valores: [],
      titulo: null,
      valor: null,
      sucesso: '',
      erro: ''
    }
  },
  methods: {
    //Pegar todos os valores da API 
    async getValores() {
      try {
        const req = await fetch("http://localhost:3000/grafico");
        const data = await req.json();
        this.valores = data;
        console.log(this.valores);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    },
    //Adicionar valores da API
    async createValor(){
        const date = {
          valor: this.valor,
          titulo: this.titulo
        }
        try {   
          const req = await fetch("http://localhost:3000/grafico",{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(date)
          });
          const res = await req.json();
          this.getValores();
          this.sucesso = 'Dados enviados com sucesso!';
        } catch (error) {
          console.log(error)
          this.erro = `Erro: ${error.message}`;
        }
    },
    //Deletar dados da API
    async deletarValor(id){
      try {
        const req = await fetch(`http://localhost:3000/grafico/${id}`,{
          method: 'DELETE'
        });
        const res = await req.json();
        this.getValores();
        this.sucesso = 'Dados deletado com sucesso!';
        console.log(id)
      } catch (error) {
        this.erro = `Erro: ${error.message}`;
      }
    }
  },
  mounted(){
    this.getValores();
  }
}
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentacao</template>

    <p>O <a href="/grafico" rel="noopener">grafico Bolsa de valores</a>
    mostra um grafico treemap dos valores mensais da bolsa de valores do IBM.</p>
    <p>O <a href="/graficoApi" rel="noopener">grafico API interna</a>
    mostra um grafico treemp de uma API fake onde os dados podem ser editados, a tabela abaixo
    e os dados dessa API fake (Estou usando json-server para simular uma API).</p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Dados da API fake</template>
    <div v-if="sucesso">
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>{{ sucesso }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
    <div v-if="erro">
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>{{ erro }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th scope="col">Titulo</th>
          <th scope="col">Valor</th>
          <th scope="col">Ecoes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in valores" :key="index">
          <td>{{ item.titulo }}</td>
          <td>{{ item.valor }}</td>
          <td>
            <button class="btn btn-danger" @click="deletarValor(item.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Novos dados
    </button>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: black;" id="exampleModalLabel">Novos dados</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createValor">
                <div class="mb-3">
                  <label style="color: black;" for="titulo" class="form-label">Titulo</label>
                  <input type="text" v-model="titulo" name="titulo" class="form-control" id="titulo" required>
                </div>
                <div class="mb-3">
                  <label style="color: black;" for="valor" class="form-label">Valor</label>
                  <input type="number" v-model="valor" name="valor" class="form-control" id="valor" required>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                  <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Salvar</button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  </WelcomeItem>
</template>
