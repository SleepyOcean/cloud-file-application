<template>
	<div class="file-system full">
		<div class="fs-header-box">
			<div class="fs-title-bar v-center-box">
				<div class="fs-logo"></div>
				<div class="fs-title v-center-box" style="-webkit-app-region: drag">{{ title }}</div>
				<div class="fs-frame-options v-center-box">
					<i
						class="fs-frame-options-item iosfont icon-ios-remove minus center-box"
						@click="minusWindow"
					/>
					<i
						class="fs-frame-options-item iosfont icon-ios-qr-scanner max center-box"
						@click="maxWindow"
					/>
					<i
						class="fs-frame-options-item iosfont icon-ios-close close center-box"
						@click="closeWindow"
					/>
				</div>
			</div>
			<div class="fs-nav-bar v-center-box">
				<div class="fs-nav-option">
					<i class="iosfont icon-ios-arrow-back" title="后退"/>
				</div>
				<div class="fs-nav-option">
					<i class="iosfont icon-ios-arrow-forward" title="前进"/>
				</div>
				<div class="fs-nav-option">
					<i class="iosfont icon-ios-arrow-up" title="上移"/>
				</div>
				<div class="fs-nav-address-box">
					<div class="fs-nav-address-bar" :class="{'editing': getAddressEditStatus()}">
						<div class="fs-nav-address-option">
							<i
								class="iosfont icon-ios-desktop"
								title="返回主目录"
							/>
						</div>
						<div class="fs-nav-address">
							<i class="iosfont icon-ios-play"/>
							<address-label ref="addressLabelRef" v-model="current.path" @addressSearch="addressConfirm"/>
						</div>
						<div class="fs-nav-address-option">
							<i
								class="iosfont icon-ios-refresh"
								title="刷新"
								@click="refresh"
							/>
						</div>
						<div class="fs-nav-address-option">
							<i
								class="iosfont icon-ios-arrow-down"
								title="上一个位置"
							/>
						</div>
					</div>
				</div>
				<div class="fs-nav-option fs-nav-tools-box">
					<i class="iosfont icon-ios-cog" title="设置"/>
				</div>
				<div class="fs-nav-option fs-nav-tools-box" id="filePickerId">
					<i class="iosfont icon-ios-cloud-upload" title="上传文件"/>
				</div>
			</div>
		</div>
		<div class="fs-content-box">
			<div class="fs-shortcut-box">
				<div
					class="fs-shortcut-item"
					v-for="(item, index) in shortcuts"
					:key="index + '-shortcuts'"
					@click="item.unfold = !item.unfold"
				>
					<file-icon :name="getIcon(item.type)"/>
					<span class="fs-shortcut-item-name ">{{ item.name }}</span>
				</div>
			</div>
			<div class="fs-file-box" ref="ffbRef" id="ffbId">
				<file-shortcut @click.native="current.fileSelected = index"
							   :class="current.fileSelected === index ? 'active':''"
							   :style="'margin: 0 ' + cssConfig.fsiMargin" :key="index" :file="item"
							   v-for="(item, index) in home.dirs[0].sub.concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub[0].sub).concat(home.dirs[0].sub[1].sub)"/>
			</div>
		</div>
	</div>
</template>

<script>
	import AddressLabel from './components/AddressLabel';
	import FileIcon from './components/FileIcon';
	import FileShortcut from './components/FileShortcut';
	import '../assets/icon/online/filefont.js';
	import '../assets/icon/ios/iconfont.css';
	import WebUploader from 'webuploader';
	const fs = require('fs');
	const ipc = require('electron').ipcRenderer;
	export default {
		name: 'FileSystem',
		components: {
			FileIcon,
			FileShortcut,
			AddressLabel
		},
		data() {
			return {
				cssConfig: {
					fsiMargin: ''
				},
				title: '云文件管理系统',
				current: {
					path: '沉洋云盘',
					shortcutSelected: -1,
					fileSelected: -1
				},
				shortcuts: [
					{
						name: '文档',
						path: '',
						type: 'doc',
						unfold: false
					},
					{
						name: '图片',
						path: '',
						type: 'img',
						unfold: false
					},
					{
						name: '音乐',
						path: '',
						type: 'music',
						unfold: false
					},
					{
						name: '视频',
						path: '',
						type: 'video',
						unfold: false
					}
				],
				home: {
					name: '沉洋云盘',
					path: '',
					dirs: [
						{
							name: 'code',
							path: '',
							type: 'dir',
							unfold: false,
							sub: [{
								name: 'blog-front',
								path: '',
								type: 'dir',
								unfold: false,
								sub: [{
									name: 'package.json',
									path: '',
									type: '.json',
									unfold: false
								}, {
									name: 'index.html',
									path: '',
									type: '.html',
									unfold: false
								}]
							}, {
								name: 'blog-server',
								path: '',
								type: 'dir',
								unfold: false,
								sub: [{
									name: 'readme.png',
									path: '',
									type: '.png',
									unfold: false
								}, {
									name: 'aboutMe.mp4',
									path: '',
									type: '.mp4',
									unfold: false
								}]
							}, {
								name: '测试文件夹',
								path: '',
								type: 'dir',
								unfold: false,
								sub: [{
									name: 'readme.png',
									path: '',
									type: '.png',
									unfold: false
								}, {
									name: 'aboutMe.mp4',
									path: '',
									type: '.mp4',
									unfold: false
								}]
							}]
						},
						{
							name: 'music',
							path: '',
							type: 'dir',
							unfold: false
						},
						{
							name: 'photo',
							path: '',
							type: 'dir',
							unfold: false
						},
						{
							name: 'cinema',
							path: '',
							type: 'dir',
							unfold: false
						}
					]
				}
			};
		},
		mounted() {
			this.resize();
			let self = this;
			const uploader = WebUploader.create({
				auto: true, // 选完文件后，是否自动上传。
				server: 'http://localhost:9999/resource/file/upload', // 文件接收服务端。
				pick: '#filePickerId' // 内部根据当前运行是创建，可能是input元素，也可能是flash. 这里是div的id
			});

			uploader.on('fileQueued', function(file) {
				// 选中文件时要做的事情，比如在页面中显示选中的文件并添加到文件列表，获取文件的大小，文件类型等
				console.log(file.ext); // 获取文件的后缀
				console.log(file.size); // 获取文件的大小
				console.log(file.name);
			});

			uploader.on('uploadProgress', function(file, percentage) {
				console.log(percentage * 100 + '%');
			});

			uploader.on('uploadSuccess', function(file, response) {
				console.log(file.id + '传输成功');
			});

			uploader.on('uploadError', function(file) {
				console.log(file);
				console.log(file.id + 'upload error');
			});

			this.$refs['ffbRef'].addEventListener('drop', (e) => {
				e.preventDefault();
				const files = e.dataTransfer.files;
				if (files) {
					console.log('path', files[0].path);
					const content = fs.readFileSync(files[0].path);
					console.log('content', content.toString());
				}
			});
			this.$refs['ffbRef'].addEventListener('dragover', (e) => {
				e.preventDefault();
			});
			window.onresize = () => {
				return (() => {
					self.resize();
				})();
			};
		},
		methods: {
			minusWindow() {
				ipc.send('window-min');
			},
			maxWindow() {
				ipc.send('window-max');
			},
			closeWindow() {
				ipc.send('window-close');
			},
			resize() {
				if (this.$refs && this.$refs['ffbRef']) {
					let newVal = this.$refs['ffbRef'].clientWidth;
					let margin = (newVal % 100) / ((newVal / 100) * 2);
					this.cssConfig.fsiMargin = margin + 'px';
				}
			},
			refresh(){
				if (this.$refs && this.$refs['addressLabelRef']) {
					console.log(this.$refs['addressLabelRef'].val);
				}
			},
			addressConfirm (address) {
				console.log(address);
			},
			getIcon(type) {
				switch (type) {
				case 'music':
					return 'icon-file_music';
				case 'doc':
					return 'icon-file_word';
				case 'img':
					return 'icon-file_img';
				case 'video':
					return 'icon-file_video';
				case 'dir':
					return 'icon-folder';
				}
			},
			getAddressEditStatus() {
				if (this.$refs && this.$refs['addressLabelRef']) {
					return this.$refs['addressLabelRef'].editing;
				}
			}
		}
	};
</script>

<style lang="scss">
	.file-system {
		user-select: none;
		overflow: hidden;

		i {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			transition: all 0.1s ease-in-out;
		}

		.fs-header-box {
			height: calc(36px + 46px);

			.fs-title-bar {
				height: 36px;
				padding: 0 10px;
				justify-content: space-around;

				.fs-logo {
					height: 30px;
					width: 30px;
					background-size: 30px;
					background-image: url("../assets/img/whale.svg");
					background-position: center;
					background-repeat: no-repeat;
				}

				.fs-title {
					height: 100%;
					width: 100%;
					justify-content: center;
					color: white;
					font-size: 12px;
					font-weight: lighter;
					letter-spacing: 2px;
				}

				.fs-frame-options {
					height: 100%;
					float: right;

					i {
						float: left;
						height: 16px;
						width: 16px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 10px;
						font-weight: bold;
						margin: 0 5px;
						transition: all 0.1s ease-in-out;

						&.close {
							color: #ff5f56;
							background: #ff5f56;
						}

						&.minus {
							color: #24ca3f;
							background: #24ca3f;
						}

						&.max {
							color: #ffbe2a;
							background: #ffbe2a;
						}

						&:hover {
							color: white;
						}

						&:active,
						&:focus {
							background: #17889c;
						}
					}
				}
			}

			.fs-nav-bar {
				height: 46px;

				.fs-nav-option {
					height: 100%;
					width: 46px;
					color: #bbc4d5;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					float: left;

					i {
						height: 32px;
						width: 32px;

						&:hover {
							color: white;
						}

						&:active,
						&:focus {
							background: #17889c;
						}
					}
				}

				.fs-nav-address-box {
					float: left;
					height: 100%;
					width: calc(100% - 46px * 5);
					display: flex;
					align-items: center;
					padding-left: 10px;

					.fs-nav-address-bar {
						height: 32px;
						width: 100%;
						min-width: 400px;
						border-radius: 20px;
						padding: 0 20px;
						background: #5b6682;

						&.editing {
							background: transparent;
							animation: twinkle 1.2s infinite ease-in;
							border: 2px solid #9599c5;
							box-sizing: content-box;
						}
						@keyframes twinkle {
							from {
								border-color: #9599c5;
							}

							65% {
								border-color: #9599c500;
							}

							to {
								border-color: #9599c5;
							}
						}

						.fs-nav-address-option {
							height: 100%;
							width: 40px;
							color: #bbc4d5;
							font-weight: bold;
							display: flex;
							align-items: center;
							justify-content: center;
							float: left;

							i {
								height: 30px;
								width: 30px;

								&:hover {
									color: white;
								}

								&:active,
								&:focus {
									background: #2f3649;
								}
							}
						}

						.fs-nav-address {
							color: #d6c5c5;
							height: 100%;
							letter-spacing: 1px;
							width: calc(100% - 40px - 80px);
							display: flex;
							align-items: center;
							font-size: 14px;
							float: left;

							i {
								padding-right: 5px;
								font-size: 12px;
							}
						}
					}
				}
				#filePickerId {
					input {
						opacity: 0;
						height: 100%;
						width: 100%;
					}
					label {
						display: none !important;
					}
				}
				.fs-nav-tools-box {
					i {
						font-size: 22px;
						font-weight: lighter;
						color: white;

					}
					&:hover {
						i {
							color: #cad0ec;
						}
					 }
					&:active,
					&:focus {
						i {
							background: #2f3649;
						}
					}
				}
			}
		}

		.fs-content-box {
			height: calc(100% - 36px - 46px);
			background: white;

			.fs-shortcut-box {
				float: left;
				height: 100%;
				width: 200px;
				overflow: auto;
				border-right: 1px solid #e8eff1;

				.fs-shortcut-item {
					display: flex;
					align-items: center;
					height: 60px;
					padding-left: 20px;
					font-size: 40px;
					user-select: none;
					cursor: default;

					.fs-shortcut-item-name {
						font-size: 12px;
						padding-left: 12px;
					}

					&:hover {
						background: #e5f3ff;
					}
				}
			}

			.fs-file-box {
				float: right;
				overflow: auto;
				height: 100%;
				width: calc(100% - 200px);
			}
		}
	}
</style>
