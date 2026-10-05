<template>
  <el-card class="tarjeta-libro" shadow="hover">
  <article class="libro-card">
    <div class="portada">
      <img
        v-if="libro.portada"
        :src="libro.portada"
        :alt="`Portada de ${libro.titulo}`"
      />

      <span v-else>📖</span>
    </div>

    <div class="informacion">
      <el-tag effect="light">{{ libro.categoria }}</el-tag>

      <h2>{{ libro.titulo }}</h2>
      <p class="autor">por {{ libro.autor }}</p>

      <p v-show="libro.descripcion" class="descripcion">
        {{ libro.descripcion }}
      </p>

      <div class="acciones-libro">
      <router-link
  :to="{ name: 'detalle-libro', params: { id: libro.id } }"
  custom
  v-slot="{ href, navigate }"
>
  <el-button
    tag="a"
    :href="href"
    type="primary"
    @click="navigate"
  >
    Ver detalle
  </el-button>
</router-link> <router-link
  :to="{
    name: 'detalle-libro',
    params: { id: libro.id },
    query: { editar: '1' }
  }"
  custom
  v-slot="{ href, navigate }"
>
  <el-button
    tag="a"
    :href="href"
    type="primary"
    plain
    @click="navigate"
  >
    Editar
  </el-button>
</router-link>
      
      <el-button
  native-type="button"
  :type="esFavorito ? 'warning' : 'default'"
  :plain="!esFavorito"
  :aria-pressed="esFavorito"
  @click="$emit('favorito', libro.id)"
>
  {{ esFavorito ? '★ Quitar favorito' : '☆ Favorito' }}
</el-button>
      <el-button
  type="danger"
  native-type="button"
  :disabled="ocupado"
  @click="$emit('eliminar', libro.id)"
>
  Eliminar
</el-button>
      </div>
    </div>
  </article>
  </el-card>
</template>

<script>
export default {
  name: "LibroCard",

  emits: ["eliminar", "favorito"],

  props: {
    esFavorito: Boolean,
    ocupado: Boolean,
    libro: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.tarjeta-libro { border-radius: 14px; }
.libro-card { display: flex; gap: 20px; }
.acciones-libro { display: flex; flex-wrap: wrap; gap: 8px; }
.acciones-libro :deep(.el-button) { margin: 0; }

.portada {
  display: grid;
  flex-shrink: 0;
  width: 100px;
  height: 140px;
  place-items: center;
  overflow: hidden;
  border-radius: 8px;
  background: var(--bl-suave);
  font-size: 45px;
}

.portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.informacion {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}

.categoria {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  background: var(--bl-suave);
  color: var(--bl-acento);
  font-size: 13px;
  font-weight: bold;
}

h2 {
  margin-bottom: 6px;
}

.autor {
  margin-top: 0;
  color: var(--bl-secundario);
}

.descripcion {
  color: var(--bl-secundario);
  line-height: 1.5;
}
 



@media (max-width: 600px) {
  .libro-card { flex-direction: column; }
}
</style>
