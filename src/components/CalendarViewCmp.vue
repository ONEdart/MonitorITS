<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button class="btn btn-ghost btn-sm" @click="prevMonth">&larr;</button>
      <h3 class="calendar-month">{{ monthLabel }}</h3>
      <button class="btn btn-ghost btn-sm" @click="nextMonth">&rarr;</button>
      <button class="btn btn-secondary btn-sm" @click="goToToday">Today</button>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day-header" v-for="d in dayHeaders" :key="d">{{ d }}</div>
      <div
        v-for="(day, idx) in daysInMonth"
        :key="idx"
        class="calendar-cell"
        :class="{ 'empty': !day, 'today': isToday(day) }"
      >
        <span class="day-number" v-if="day">{{ day }}</span>
        <div class="day-events" v-if="day">
          <div
            v-for="evt in getEventsForDay(day).slice(0, 2)"
            :key="evt.id"
            class="day-event"
            :style="{ background: evt.color || '#3b82f6' }"
            :title="evt.title"
            @click="$emit('event-click', evt)"
          >
            {{ evt.title }}
          </div>
          <div v-if="getEventsForDay(day).length > 2" class="day-more">
            +{{ getEventsForDay(day).length - 2 }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCalendar } from '@/composables/useCalendar'

defineEmits(['event-click'])
const {
  currentMonth, currentYear, monthLabel, daysInMonth,
  goToToday, prevMonth, nextMonth, getEventsForDay
} = useCalendar()

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isToday(day) {
  if (!day) return false
  const now = new Date()
  return (
    currentYear.value === now.getFullYear() &&
    currentMonth.value === now.getMonth() &&
    day === now.getDate()
  )
}
</script>

<style scoped>
.calendar-view {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.calendar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
}
.calendar-month {
  font-size: 1rem;
  flex: 1;
  text-align: center;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar-day-header {
  padding: 8px;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  background: var(--color-neutral-bg);
  border-bottom: 1px solid var(--color-border);
}
.calendar-cell {
  min-height: 90px;
  padding: 6px;
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  font-size: 0.8125rem;
}
.calendar-cell:nth-child(7n) { border-right: none; }
.calendar-cell.empty { background: var(--color-bg); }
.calendar-cell.today {
  background: var(--color-accent-light);
}
.day-number {
  font-weight: 600;
  font-size: 0.8125rem;
  display: block;
  margin-bottom: 4px;
}
.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.day-event {
  font-size: 0.675rem;
  color: #fff;
  padding: 1px 5px;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.day-more {
  font-size: 0.625rem;
  color: var(--color-text-muted);
}
</style>