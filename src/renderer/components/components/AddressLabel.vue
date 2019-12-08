<template>
	<div class="address-label" v-click-outside="() => editing = false" @click="editStatusChange(true)">
		<div class="label-box" :class="{'disabled': disabled}" v-show="!editing" title="点击修改">{{val || placeholder}}<i class=""></i></div>
		<div class="edit-box" v-show="editing && !disabled">
			<el-input ref='labelInputRef' v-model="val" :placeholder="placeholder" :autofocus="true">
			</el-input>
			<el-button type="text" title="取消"></el-button>
		</div>
	</div>
</template>

<script>
export default {
  name: 'AddressLabel',
  props: {
    value: {
      type: String,
      default: '默认label'
    },
    placeholder: {
      type: String,
      default: '——'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editing: false,
      val: ''
    }
  },
  mounted () {
    this.val = this.value
  },
  watch: {
    value: (newVal, oldVal) => {
      this.val = newVal
    },
    val: (newVal, oldVal) => {
      this.$emit && this.$emit('update:value', newVal)
    }
  },
  methods: {
    editStatusChange (status) {
      if (this.disabled) return
      this.editing = status
      if (status) {
        setTimeout(() => {
          this.$refs.labelInputRef.focus()
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.address-label {
	display: flex;
	align-items: center;
	height: 100%;
	min-width: 200px;
	width: 100%;
	cursor: text;

	.label-box {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		color: #f0f4fd;
		padding-right: 15px;
		font-size: 14px;
		cursor: text;

		&.disabled {
			cursor: not-allowed;
		}
	}
	.edit-box {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		/deep/ .el-input__inner {
			background: unset;
			letter-spacing: unset;
			padding: 0;
			color: #f0f4fd;
			display: flex;
			align-items: center;
			height: 100%;
			border-radius: unset;
		}

		/deep/ .el-input {
			animation: twinkle 1.2s infinite ease-in;
		}
	}
}
</style>
