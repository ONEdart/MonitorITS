<template>
  <div class="data-table-wrapper">
    <table class="data-table" v-if="rows.length">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="col.width ? { width: col.width } : {}">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="row.id || idx" @click="$emit('row-click', row)" :class="{ clickable: $attrs.onRowClick }">
          <td v-for="col in columns" :key="col.key">
            <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]" :index="idx">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <EmptyState v-else title="No data" description="Nothing to display yet." />
  </div>
</template>

<script setup>
import EmptyState from './EmptyState.vue'
defineProps({ columns: Array, rows: Array })
defineEmits(['row-click'])
</script>

<style scoped>
.data-table-wrapper {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.data-table th {
  text-align: left;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: var(--color-neutral-bg);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  vertical-align: middle;
}
.data-table tbody tr:hover {
  background: var(--color-bg);
}
.data-table tbody tr.clickable {
  cursor: pointer;
}
</style>