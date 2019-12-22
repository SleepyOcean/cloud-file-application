<template>
	<div class="address-label" v-click-outside="() => editing = false" @click="editStatusChange(true)">
		<div class="label-box" :class="{'disabled': disabled}" v-show="!editing" title="点击修改">{{value || '根目录'}}<i class=""></i></div>
		<div class="edit-box" v-show="editing && !disabled">
			<input ref='labelInputRef' v-model.lazy="value" @keyup.enter="onSubmit" autofocus/>
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
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			editing: false
		};
	},
	methods: {
		editStatusChange (status) {
			if (this.disabled) return;
			this.editing = status;
			if (status) {
				setTimeout(() => {
					this.$refs['labelInputRef'].focus();
				}, 300);
			}
		},
		onSubmit () {
			this.editStatusChange(false);
			this.$emit('addressSearch', this.value);
		}
	}
};
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
		font-size: 12px;
		cursor: text;
		user-select: auto;

		&.disabled {
			cursor: not-allowed;
		}
	}
	.edit-box {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		user-select: auto;

		input {
			width: 100%;
			border: unset;
			background: transparent;
			font-size: 12px;
			color: white;
			letter-spacing: inherit;
			font-family: inherit;
			&:focus {
				outline: unset;
			}
		}

	}
}
</style>
