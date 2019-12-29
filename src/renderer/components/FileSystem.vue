<template>
	<div class="file-system full">
		<div class="fs-header-box">
			<div class="fs-title-bar v-center-box">
				<div class="fs-logo">
				</div>
				<div class="fs-title v-center-box" style="-webkit-app-region: drag">{{ title }}</div>
				<div class="fs-frame-options v-center-box">
					<i
						class="fs-frame-options-item iosfont icon-ios-remove minus center-box"
						@click="minusWindow"
					/>
					<i
						class="fs-frame-options-item iosfont icon-ios-resize max center-box"
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
								class="iosfont icon-ios-cloudy"
								title="设置云地址"
								@click="window.input = true"
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
					</div>
				</div>
				<div class="fs-nav-option fs-nav-tools-box" id="filePickerId">
					<i class="iosfont icon-ios-cloud-upload" title="上传文件"/>
				</div>
				<div class="fs-nav-option fs-nav-tools-box" @click="window.about = true">
					<i class="iosfont icon-ios-help-circle-outl" title="关于"/>
				</div>
			</div>
		</div>
		<div class="fs-content-box" id="fcbId">
			<div class="fs-shortcut-box" v-if="false">
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
			<div class="fs-file-box" ref="ffbRef" id="ffbId" v-click-outside="() => current.fileSelected = -1">
				<file-shortcut @click.native="current.fileSelected = index"
							   @dblclick.native="dirExplore(item)"
							   :class="current.fileSelected === index ? 'active':''"
							   :style="'margin: 0 ' + cssConfig.fsiMargin" :key="index" :file="item"
							   :urlSuffix="current.urlSuffix"
							   v-for="(item, index) in current.dirs"/>
			</div>
		</div>
		<div class="fs-status-bar">
			<div class="fs-status-text">{{current.dirs.length}} 个项目</div>
			<div class="fs-status-text" v-if="current.fileSelected > -1">选中1个项目</div>
			<div class="fs-status-text" v-if="current.fileSelected > -1 && current.dirs[current.fileSelected] && current.dirs[current.fileSelected].type != 'dir'">{{current.dirs[current.fileSelected].size}}</div>
		</div>
		<div class="fs-plugins-box">
			<div class="fs-audio-box" v-if="current.music">
				<audio ref="player" :src="current.music" type="audio/mpeg" autoplay="autoplay" preload="auto"
					   @ended="current.music=''" controls></audio>
			</div>
			<div class="fs-transfer-progress-box" v-if="transfer.showing">
				<div class="fs-tpb-info">
					<div class="fs-tpb-i-name" :title="transfer.fileName">{{transfer.fileName}}</div>
					<div class="fs-tpb-i-speed">5M/s · 剩余3 s</div>
				</div>
				<div class="fs-tpb-status" v-if="transfer.result === 0">
					<div class="fs-tpb-s-progress">
						<div class="fs-tpb-s-p-current" :style="'width:' +  transfer.progress"></div>
					</div>
					<span>{{transfer.progress}}</span>
					<i class=" iosfont icon-ios-close close center-box" @click="transfer.cancelFile()"/>
				</div>
				<div class="fs-tpb-result" v-if="transfer.result != 0">
					<i class=" iosfont icon-ios-checkmark-circle success center-box" v-if="transfer.result > 0"></i>
					<i class=" iosfont icon-ios-close-circle error center-box" v-if="transfer.result < 0"></i>
					{{transfer.result > 0 ? '传输成功' : '传输出错'}}
				</div>
			</div>
		</div>
		<div class="fs-photo-view" v-if="window.photo" @click.stop="1">
			<i class="iosfont icon-ios-close" @click="window.photo = false"></i>
			<img :src="getImage(current.dirs[current.fileSelected].name)" style="max-width: 100%;max-height: 100%;">
		</div>
		<div class="fs-message-box" v-if="window.message">
			<div class="fs-mb-template-1">
				<div class="fs-mb-t1-title"><i class="iosfont icon-ios-hand" style="font-size: 40px;padding-right: 10px;color: yellowgreen;display: inline;"></i>且慢！！！</div>
				<div class="fs-mb-t1-content">文件已存在，确认要覆盖之前的文件吗？</div>
				<div class="fs-mb-t1-options">
					<div class="fs-mb-t1-option btn-positive" @click="transfer.uploadFile()">确认</div>
					<div class="fs-mb-t1-option btn-negative" @click="transfer.skipFile()">取消</div>
				</div>
			</div>
		</div>
		<div class="fs-input-box" v-if="window.input">
			<div class="fs-mb-template-1">
				<div class="fs-mb-t1-title">
					<i class="iosfont icon-ios-cloud" style="font-size: 28px;padding-right: 10px;color: #3a658a;display: inline;"></i>
					配置你的私有云
					<input class="fs-mb-t1-input" ref='inputRef' v-model.lazy="form.server" @keyup.enter="submitServerUrl" autofocus/>
				</div>
				<div class="fs-mb-t1-options">
					<div class="fs-mb-t1-option btn-positive" @click="submitServerUrl">确认</div>
					<div class="fs-mb-t1-option btn-negative" @click="window.input = false">取消</div>
				</div>
			</div>
		</div>
		<div class="fs-about-box" v-if="window.about" @click.stop="window.about && (window.about = false)">
			<div class="fs-about-box-content fs-mb-template-1">
				<div class="fs-abc-head">
					<div class="fs-abc-logo"></div>
					{{title}}</div>
				<div class="fs-abc-content">
					<div class="fs-abc-c-row bold">版本 v.1.0.0</div>
					<div class="fs-abc-c-row">构建时间 2019-12-29</div>
					<div class="fs-abc-c-row"></div>
					<div class="fs-abc-c-row" style="align-items: baseline;">
						<span style="font-weight: bold;font-size: 12px;padding-right: 10px;">created by</span>
						<a style="font-size: 16px;" href="https://github.com/SleepyOcean">sleepy ocean</a>
					</div>
					<div class="fs-abc-c-row higher">
						<div class="fs-abc-link github"></div>
						<div class="fs-abc-link csdn"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AddressLabel from './components/AddressLabel';
	import FileIcon from './components/FileIcon';
	import FileShortcut from './components/FileShortcut';
	import {getDir, checkExist, merge} from '../service/fileService';
	import '../assets/icon/online/filefont.js';
	import '../assets/icon/ios/iconfont.css';
	import WebUploader from 'webuploader';
	import util from '../util/common';

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
				window: {
					photo: false,
					message: false,
					input: false,
					about: true
				},
				form: {
					server: ''
				},
				// 文件传输信息
				transfer: {
					uploader: {},
					uploadFile: {},
					skipFile: {},
					cancelFile: {},
					showing: false,
					progress: '0',
					result: 0,
					fileName: '',
					chunked: 0,
					timeCountDown: 3,
					override: false
				},
				title: '云文件管理系统',
				current: {
					music: '',
					path: '',
					urlSuffix: '',
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
			self.$nextTick(self.resize);
			self.initUploader();
			self.getDir();
			window.onresize = () => {
				return (() => {
					self.resize();
				})();
			};

			// this.transfer.showing = true;
			// this.transfer.progress = '94.2%';
			// this.transfer.fileName = '阿斯利康的飞机啊手动阀卢卡斯';
		},
		watch: {
			'current.fileSelected': function () {
				this.$nextTick(this.resize);
			}
		},
		methods: {
			initUploader() {
				let self = this;
				let hiddenMessageBox = () => {
					setTimeout(() => {
						self.transfer.showing = false;
					}, 3000);
				};
				let options = {
					resize: false,
					auto: false,
					chunked: true,
					chunkSize: 5242880,
					chunkRetry: 2,
					threads: 6,
					pick: '#filePickerId',
					dnd: '#fcbId',
					method: 'POST',
					server: self.server + '/file/upload'
				};
				self.transfer.uploader = util.noneWatch(WebUploader.create(options));
				self.transfer.uploader.on('uploadStart', function (file) {
				});
				self.transfer.uploader.on('uploadBeforeSend', function (file) {
					self.transfer.chunked++;
				});
				self.transfer.uploader.on('fileQueued', async function (file) {
					let exist = await checkExist(file.name);
					if(exist) {
						self.window.message = true;
						self.transfer.skipFile = () => {
							self.transfer.uploader.skipFile(file);
							self.transfer.uploader.reset();
							self.window.message = false;
						};
						self.transfer.uploadFile = () => {
							self.transfer.uploader.upload();
							self.transfer.result = 0;
							self.transfer.showing = true;
							self.transfer.override = false;
							self.transfer.fileName = file.name;
							self.window.message = false;
						};
					} else {
						self.transfer.uploader.upload();
						self.transfer.override = false;
						self.transfer.result = 0;
						self.transfer.showing = true;
						self.transfer.fileName = file.name;
					}
					self.transfer.cancelFile = () => {
						self.transfer.uploader.cancelFile(file);
						self.transfer.uploader.reset();
						self.transfer.progress = '0';
						self.transfer.showing = false;
					};
					// 选中文件时要做的事情，比如在页面中显示选中的文件并添加到文件列表，获取文件的大小，文件类型等
					console.log('文件的后缀' + file.ext); // 获取文件的后缀
					console.log('文件的大小' + file.size); // 获取文件的大小
					console.log('文件的名称' + file.name);
				});
				self.transfer.uploader.on('uploadProgress', function (file, percentage) {
					self.transfer.progress = (percentage * 100 + '').substring(0, 4) + '%';
					console.log('传输进度：' + percentage * 100 + '%');
				});
				self.transfer.uploader.on('uploadSuccess', function (file, response) {
					let success = () => {
						self.transfer.result = 1;
						self.transfer.progress = '0';
						hiddenMessageBox();
						self.getDir();
						self.transfer.uploader.reset();
					};
					if(self.transfer.chunked > 1){
						merge(file.name).then(data => {
							if(data === 'success') {
								success();
							} else {
								self.transfer.result = -1;
							}
						});
					} else {
						success();
					}
				});
				self.transfer.uploader.on('uploadError', function (file) {
					self.transfer.result = -1;
					console.log('传输内容：' + file);
					console.log('upload error' + file.id);
				});
			},
			submitServerUrl () {
				this.server = this.form.server;
				this.window.input = false;
				this.getDir();
			},
			getDir() {
				getDir(this.current.path).then(data => {
					this.current.dirs = data.dir;
					this.current.urlSuffix = this.server + '/file/get?dir=' + this.current.path + '/';
				});
			},
			getImage (name) {
				return this.current.urlSuffix + encodeURIComponent(name);
			},
			dirExplore(item) {
				if (item.type === 'dir') {
					if (this.current.path.indexOf('/') > -1 || this.current.path !== '') {
						this.current.path += `/${item.name}`;
					} else {
						this.current.path += `${item.name}`;
					}
					this.getDir();
				} else if (item.type === '.wav') {
					this.current.music = this.server + '/file/get?dir=' + this.current.path + item.name;
				} else if (item.category === 'image') {
					this.window.photo = true;
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
					background-size: 20px;
					background-image: url("../assets/img/cloud-file-logo.svg");
					background-position: center;
					background-repeat: no-repeat;
				}

				.fs-title {
					height: 100%;
					width: 100%;
					justify-content: flex-start;
					color: white;
					font-size: 12px;
					font-weight: lighter;
					letter-spacing: 2px;
					padding-left: 5px;
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
							width: calc(100% - 40px - 40px);
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
				max-height: 100%;
				width: 100%;
				/*width: calc(100% - 200px);*/
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
		.fs-plugins-box {
			position: absolute;
			bottom: 30px;
			right: 10px;
			display: flex;
			align-items: flex-end;
			flex-direction: column;

			.fs-audio-box {
				width: 200px;
				height: 32px;

				audio {
					width: 100%;
				}
			}

			.fs-transfer-progress-box {
				width: 400px;
				height: 60px;
				margin-top: 10px;
				border-radius: 10px;
				border: 1px solid #e9eced;
				box-shadow: 0 0 5px 2px #e9eced;
				background: white;
				padding: 0 10px;
				display: flex;
				align-items: center;
				flex-direction: row;
				justify-content: space-between;
				cursor: default;

				.fs-tpb-info, .fs-tpb-status, .fs-tpb-result {
					height: 100%;
					display: flex;
					align-items: center;
					font-size: 14px;
				}

				.fs-tpb-info {
					width: 160px;
					display: flex;
					justify-content: center;
					flex-direction: column;

					.fs-tpb-i-name, .fs-tpb-i-speed {
						width: 100%;
					}

					.fs-tpb-i-name {
						font-size: 14px;
						font-weight: bold;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						margin-bottom: 4px;
					}

					.fs-tpb-i-speed {
						font-size: 12px;
						color: #8a8c8d;
					}
				}

				.fs-tpb-status {
					justify-content: flex-end;
					span {
						width: 45px;
						padding-left: 5px;
					}
					.fs-tpb-s-progress {
						width: 120px;
						height: 4px;
						background: #c3cde2;
						border-radius: 4px;
						margin: 0 5px;

						.fs-tpb-s-p-current {
							height: 100%;
							background: #412c72;
							border-radius: 4px;
							transition: width .4s linear;
						}
					}

					i {
						margin-left: 5px;
						font-size: 30px;
						cursor: pointer;
						&:hover {
							color: #215f9e;
						}
					}
				}

				.fs-tpb-result {
					width: 120px;
					font-size: 18px;
					font-weight: bold;
					justify-content: center;

					i {
						font-size: 22px;
						margin-right: 5px;

						&.success {
							color: limegreen;
						}

						&.error {
							color: darkred;
						}
					}
				}
			}
		}
		.fs-photo-view {
			position: absolute;
			top: 0;
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #000c;
			i {
				position: absolute;
				right: 10px;
				top: 10px;
				font-size: 32px;
				font-weight: bold;
				color: white;
				&:hover {
					color: #215f9e;
				}
			}
		}
		.fs-message-box, .fs-input-box, .fs-about-box {
			position: absolute;
			top: 0;
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.fs-mb-template-1 {
				width: 360px;
				background: white;
				box-shadow: 0 0 18px 1px #b7b6b6;
				border-radius: 4px;
				padding: 10px 20px;
				cursor: default;
				.fs-mb-t1-title {
					display: inline-block;
					width: 100%;
					height: 40px;
					line-height: 40px;
					font-size: 16px;
					font-weight: bold;
					user-select: none;
					margin-bottom: 10px;
				}
				.fs-mb-t1-content {
					height: calc(100% - 40px - 40px);
					min-height: 30px;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					font-size: 14px;
				}
				.fs-mb-t1-options {
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.fs-mb-t1-option {
						height: 32px;
						font-size: 15px;
						display: flex;
						align-items: center;
						justify-content: center;
						white-space: nowrap;
						cursor: pointer;
						user-select: none;
						background-image: none;
						border-radius: 4px;
						margin: 0 10px;
						&.btn-positive {
							color: #3a658a;
							&:hover {
								color: #023471;
							}
						}
						&.btn-negative {
							color: #757577;
							&:hover {
								color: #c3bee6;
							}
						}
					}
				}
			}
		}
		.fs-input-box {
			.fs-mb-template-1 {
				width: 500px;
				.fs-mb-t1-title {
					display: flex;
					align-items: center;
					margin-bottom: 0;
					margin-top: 5px;
					.fs-mb-t1-input {
						margin-left: 20px;
						height: 60%;
					}
				}
			}
		}
		.fs-about-box {
			.fs-about-box-content {
				width: 400px;
				height: 220px;
				padding: 0;
				.fs-abc-head{
					height: 60px;
					padding-bottom: 10px;
					color: white;
					font-weight: bold;
					letter-spacing: 2px;
					padding-left: 10px;
					display: flex;
					align-items: flex-end;
					background: linear-gradient(45deg, #1d204e, #5f5f5f);
					.fs-abc-logo {
						height: 30px;
						width: 30px;
						background-size: 30px;
						margin-right: 10px;
						background-image: url("../assets/img/cloud-file-logo.svg");
						background-position: center;
						background-repeat: no-repeat;
					}
				}
				.fs-abc-content {
					height: calc(100% - 60px);
					padding: 10px 20px;
					.fs-abc-c-row {
						height: 24px;
						font-size: 14px;
						display: flex;
						align-items: center;
						&.bold {
							font-weight: bold;
						}
						&.higher {
							height: 40px;
						}
						.fs-abc-link {
							height: 30px;
							width: 30px;
							background-size: 20px;
							margin-right: 10px;
							cursor: pointer;
							background-position: center;
							background-repeat: no-repeat;
							&.github {
								background-image: url("../assets/img/gitHub.svg");
							}
							&.csdn {
								background-image: url("../assets/img/csdn.svg");
							}
						}
					}
				}
			}
		}
	}
</style>
