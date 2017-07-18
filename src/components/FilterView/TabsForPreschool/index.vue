<template>
<div class="picker-filter-tabs">
	<CenterTypeTab class="filter-tabs"></CenterTypeTab>
	<SecondLanguageTab class="filter-tabs"></SecondLanguageTab>
	<div class="filter-tabs">Filter 3</div>
	<div class="filter-tabs">Filter 4</div>
</div>
</template>

<script>
import CenterTypeTab from './CenterTypeTab'
import SecondLanguageTab from './SecondLanguageTab'

export default {
  data () {
    return {}
  },
  computed: {},
  components: {CenterTypeTab, SecondLanguageTab}
}
</script>

<style scoped>
.picker-filter-tabs {
	display: table;
	border:1px solid grey;
	width: 100%;
	height: 30px;
}

.filter-tabs {
	display:table-cell;
	height:20px;
	width: 25%;
	text-align: center;
	vertical-align: middle;
	border: 1px solid white;
	background: #e7e7e7;
	padding: 10 10 10 10;
}
</style>
