<template>
  <span
    class='icon'
    :class='{ "active": active }'
  ></span>
</template>
<script>
export default {
  name: 'ExpandIcon',
  props: {
    active: Boolean,
  }
}
</script>
<style scoped>
.icon {
	position: relative;
	margin: 0;
	margin-left: 8px;
	padding: 0;
	width: 1em;
	height: 1em;
	box-sizing: border-box;
}
.icon:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: .4em;
  height: .4em;
  border-width: 1.5px 1.5px 0 0;
  border-style: solid;
  border-color: initial;
  transform: rotate(45deg) translate(0, -50%);
  transform-origin: top;
  transition: transform .3s ease-out;
  box-sizing: border-box;
}

.icon.active:after {
  transform: rotate(135deg) translate(0, -50%);
}
</style>