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
				<div class="fs-nav-option" @click="back">
					<i class="iosfont icon-ios-arrow-back" title="后退"/>
				</div>
				<div class="fs-nav-option" @click="forward">
					<i class="iosfont icon-ios-arrow-forward" title="前进"/>
				</div>
				<div class="fs-nav-option" @click="up">
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
							<address-label ref="addressLabelRef" v-model="current.path"
										   @addressSearch="addressConfirm"/>
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
					@click="current.shortcutSelected = index"
					:class="current.shortcutSelected === index ? 'active':''"
				>
					<file-icon :name="getIcon(item.type)"/>
					<span class="fs-shortcut-item-name ">{{ item.name }}</span>
				</div>
			</div>
			<div class="fs-file-box" ref="ffbRef" id="ffbId">
				<file-shortcut @click.native="current.fileSelected = index"
							   @dblclick.native="dirExplore(item)"
							   :class="current.fileSelected === index ? 'active':''"
							   :style="'margin: 0 ' + cssConfig.fsiMargin" :key="index" :file="item" :urlSuffix="server + '/file/get?dir=' + current.path"
							   v-for="(item, index) in current.dirs"/>
			</div>
		</div>
		<div class="fs-status-bar">
			<div class="fs-status-text">20个项目</div>
			<div class="fs-status-text">选中1个文件</div>
			<div class="fs-status-text">20M</div>
		</div>
		<div class="fs-audio-box" v-if="current.music">
			<audio ref="player" :src="current.music" type="audio/mpeg" autoplay="autoplay" preload="auto" @ended="current.music=''" controls></audio>
		</div>
	</div>
</template>

<script>
	import AddressLabel from './components/AddressLabel';
	import FileIcon from './components/FileIcon';
	import FileShortcut from './components/FileShortcut';
	import {getDir} from '../service/fileService';
	import '../assets/icon/online/filefont.js';
	import '../assets/icon/ios/iconfont.css';
	import WebUploader from 'webuploader';

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
				server: 'http://localhost:9000/resource',
				cssConfig: {
					fsiMargin: ''
				},
				title: '云文件管理系统',
				current: {
					music: '',
					path: '',
					dirs: [],
					shortcutSelected: -1,
					fileSelected: -1
				},
				pathStore: {
					current: '',
					last: ''
				},
				shortcuts: [
					{
						name: '文档',
						path: '',
						type: 'doc'
					},
					{
						name: '图片',
						path: '',
						type: 'img'
					},
					{
						name: '音乐',
						path: '',
						type: 'music'
					},
					{
						name: '视频',
						path: '',
						type: 'video'
					}
				]
			};
		},
		mounted() {
			let self = this;
			self.resize();
			self.initUploader();
			self.getDir();
			window.onresize = () => {
				return (() => {
					self.resize();
				})();
			};
		},
		methods: {
			initUploader() {
				let self = this;
				const uploader = WebUploader.create({
					resize: false,
					auto: true,
					chunked: true,
					chunkRetry: 2,
					threads: 6,
					pick: '#filePickerId',
					dnd: '#ffbId',
					method: 'POST',
					server: self.server + '/file/upload'
				});
				uploader.on('fileQueued', function (file) {
					// 选中文件时要做的事情，比如在页面中显示选中的文件并添加到文件列表，获取文件的大小，文件类型等
					console.log('文件的后缀' + file.ext); // 获取文件的后缀
					console.log('文件的大小' + file.size); // 获取文件的大小
					console.log('文件的名称' + file.name);
				});
				uploader.on('uploadProgress', function (file, percentage) {
					console.log('传输进度：' + percentage * 100 + '%');
				});
				uploader.on('uploadSuccess', function (file, response) {
					console.log('传输成功' + file.id);
					self.getDir();
				});
				uploader.on('uploadError', function (file) {
					console.log('传输内容：' + file);
					console.log('upload error' + file.id);
				});
			},
			getDir() {
				getDir(this.current.path).then(data => {
					this.current.dirs = data.dir;
				});
			},
			dirExplore(item) {
				if (item.type === 'dir') {
					if(this.current.path.indexOf('/') > -1 || this.current.path !== ''){
						this.current.path += `/${item.name}`;
					} else {
						this.current.path += `${item.name}`;
					}
					this.getDir();
				} else if (item.type === '.wav') {
					this.current.music = this.server + '/file/get?dir=' + this.current.path + item.name;
				}
			},
			back() {
				if (this.current.path.indexOf('/') > -1) {
					this.pathStore.last = this.current.path;
					this.current.path = this.current.path.substring(0, this.current.path.lastIndexOf('/'));
					this.getDir();
				} else if (this.current.path !== '') {
					this.pathStore.last = this.current.path;
					this.current.path = '';
					this.getDir();
				}
			},
			forward() {
				this.current.path = this.pathStore.last;
				this.getDir();
			},
			up() {
				this.back();
			},
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
					let margin = (newVal % 120) / ((newVal / 120) * 2);
					this.cssConfig.fsiMargin = margin + 'px';
				}
			},
			refresh() {
				if (this.$refs && this.$refs['addressLabelRef']) {
					this.getDir();
				}
			},
			addressConfirm(address) {
				this.current.path = address;
				this.getDir();
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
			height: calc(100% - 36px - 46px - 24px);
			background: white;

			.fs-shortcut-box {
				float: left;
				height: 100%;
				width: 200px;
				overflow: auto;
				border-right: 1px solid #e8eff1;
				border-left: 1px solid #e8eff1;

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

					&:hover, &.active {
						background: #e5f3ff;
					}
				}
			}

			.fs-file-box {
				float: left;
				overflow: auto;
				height: 100%;
				width: calc(100% - 200px);
			}
		}

		.fs-status-bar {
			background: white;
			height: 24px;
			border-top: 1px solid #e8eff1;
			display: flex;
			align-items: center;
			.fs-status-text {
				font-size: 12px;
				padding: 0 14px;
				color: #5b6682;
			}
		}

		.fs-audio-box {
			position: absolute;
			bottom: 30px;
			right: 20px;
			width: 300px;
			height: 32px;
			audio {
				width: 100%;
			}
		}
	}
</style>
