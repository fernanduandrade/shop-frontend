<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import ClientApi from '~/api/Client/ClientApi'
import { ClientDTO } from '~/clients/types/index'
import ClientForm from '~/clients/components/ClientForm.vue'
import DeleteClientForm from '~/clients/components/DeleteClientForm.vue'
const clientColumn = ref<string[]>([
  'name', 'debt', 'credit', 'phone', 'isActive',
])

const clients = ref<ClientDTO[]>([])
const { search, data } = useFilter(clients, 'name')

const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(false)
const hasPreviousPage = ref(false)
const hasNextPage = ref(false)
const totalPages = ref(0)
const totalCount = ref(0)
const ids = ref<string[]>([])

async function getClients(pageNumber: number, pageSize: number) {
  isLoading.value = !isLoading.value
  const { data } = await ClientApi.getPaginate({ pageNumber, pageSize })
  clients.value = data.items
  hasPreviousPage.value = data.hasPreviousPage
  hasNextPage.value = data.hasNextPage
  totalPages.value = data.totalPages
  totalCount.value = data.totalCount
  isLoading.value = !isLoading.value
}

onMounted(async() => {
  await getClients(1, 10)
})

const modal = useModal()
const toast = useToast()
const onSubscribeEvent = ref('')

function createClientModal() {
  onSubscribeEvent.value = uuidv4()
  modal.open({ component: markRaw(ClientForm), title: 'Cadastro de Cliente', subscribe: onSubscribeEvent.value })
}

const { modalEmitValue } = storeToRefs(modal)

async function changeClientPage(evt: any) {
  await getClients(evt.pageNumber, evt.pageSize)
}

function deleteClientsModal() {
  if (!ids.value.length) {
    toast.info('Nenhum registro selecionado')
    return
  }
  onSubscribeEvent.value = uuidv4()
  modal.open({
    component: markRaw(DeleteClientForm),
    props: { ids: ids.value },
    title: 'Exclusão de clientes',
    description: 'Você irá excluir todos os clientes selecionados.',
    subscribe: onSubscribeEvent.value,
  })
}

watch(modalEmitValue, async(newValue) => {
  if (newValue === onSubscribeEvent.value) {
    await getClients(1, 10)
    ids.value = []
    return
  }
  clients.value.splice(0, 0, newValue as ClientDTO)
})

function onSelectId(evt: string[]) {
  ids.value = evt
}

</script>
<template>
  <main class="container">
    <div class="client__actions">
      <VInputSearch v-model="search" placeholder="Pesquise pelo nome" />
      <VButton :transparent="true" :outline="true" @click="deleteClientsModal">
        Deletar pedido(s)
      </VButton>
      <VButton @click="createClientModal">
        Novo cliente
      </VButton>
    </div>
    <VTable
      :columns="clientColumn"
      :data="data"
      page="clients"
      :is-loading="isLoading"
      @select-ids="onSelectId"
    />
    <Pagination
      :total-count="totalCount"
      :total-pages="totalPages"
      :page-number="currentPage"
      :page-size="pageSize"
      @update-page="changeClientPage"
    />
  </main>
</template>

<style scoped>

.client__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
