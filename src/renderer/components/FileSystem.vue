<template>
	<div class="file-system full">
		<div class="fs-header-box">
			<div class="fs-title-bar v-center-box">
				<div class="fs-logo"></div>
				<div class="fs-title v-center-box" style="-webkit-app-region: drag">{{ title }}</div>
				<div class="fs-frame-options v-center-box">
					<i
						class="fs-frame-options-item line-icon icon-minus center-box"
						@click="minusWindow"
					></i>
					<i
						class="fs-frame-options-item line-icon icon-stop center-box"
						@click="maxWindow"
					></i>
					<i
						class="fs-frame-options-item line-icon icon-close center-box"
						@click="closeWindow"
					></i>
				</div>
			</div>
			<div class="fs-nav-bar v-center-box">
				<div class="fs-nav-option">
					<i class="line-icon icon-b-1"></i>
				</div>
				<div class="fs-nav-option">
					<i class="line-icon icon-b-2"></i>
				</div>
				<div class="fs-nav-option">
					<i class="line-icon icon-b-155"></i>
				</div>
				<div class="fs-nav-address-box">
					<div class="fs-nav-address-bar">
						<div class="fs-nav-address-option">
							<i
								class="iosfont icon-ios-desktop"
								title="返回主目录"
							></i>
						</div>
						<div class="fs-nav-address">
							<i class="iosfont icon-ios-play"></i>
							<address-label v-model="currentPath"></address-label>
						</div>
						<div class="fs-nav-address-option">
							<i
								class="iosfont icon-ios-refresh"
								title="刷新"
							></i>
						</div>
						<div class="fs-nav-address-option">
							<i
								class="iosfont icon-ios-arrow-down"
								title="上一个位置"
							></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="fs-content-box">
			<div class="fs-shortcut-box">
				<div class="fs-shortcut-item fs-shortcut-title">
					<i class="iosfont icon-ios-arrow-forward"></i>
					<i class="iosfont icon-ios-star" style="color: yellow"></i>
					快速访问
				</div>
				<div
					class="fs-shortcut-item fs-shortcut-sub-item"
					v-for="(item, index) in shortcuts"
					:key="index + '-shortcuts'"
					@click="item.unfold = !item.unfold"
				>
					<i
						class="iosfont icon-ios-arrow-forward"
						:class="{ unfold: item.unfold }"
					></i>
					<file-icon :name="getIcon(item.type)"></file-icon>
					{{ item.name }}
				</div>
				<div class="fs-shortcut-item fs-shortcut-title">
					<i class="iosfont icon-ios-arrow-forward"></i>
					<i
						class="iosfont icon-ios-cloud"
						style="color: #006e8d"
					></i>
					{{ home.name }}
				</div>
				<div
					class="fs-shortcut-item fs-shortcut-sub-item"
					v-for="(item, index) in home.dirs"
					:key="index + '-dirs'"
					@click="item.unfold = !item.unfold"
				>
					<i
						class="iosfont icon-ios-arrow-forward"
						:class="{ unfold: item.unfold }"
					></i>
					<file-icon :name="getIcon(item.type)"></file-icon>
					{{ item.name }}
				</div>
			</div>
			<div class="fs-file-box" ref="ffbRef">
				<file-shortcut :style="'width:' + cssConfig.fsiWidth" v-for="(item, index) in home.dirs[0].sub.concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub).concat(home.dirs[0].sub[0].sub).concat(home.dirs[0].sub[1].sub)" :key="index" :file="item"></file-shortcut>
			</div>
		</div>
	</div>
</template>

<script>
import AddressLabel from './components/AddressLabel'
import FileIcon from './components/FileIcon'
import FileShortcut from './components/FileShortcut'
import '../assets/icon/online/filefont.js'
import '../assets/icon/online/linefont.css'
import '../assets/icon/ios/iconfont.css'

const ipc = require('electron').ipcRenderer
export default {
  name: 'FileSystem',
  components: {
    FileIcon,
    FileShortcut,
    AddressLabel
  },
  data () {
    return {
      cssConfig: {
        fsiWidth: ''
      },
      title: '云文件管理系统',
      currentPath: '此电脑',
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
    }
  },
  mounted () {
    this.resize()
    let self = this
    window.onresize = () => {
      return (() => {
        self.resize()
      })()
    }
  },
  methods: {
    minusWindow () {
      ipc.send('window-min')
    },
    maxWindow () {
      ipc.send('window-max')
    },
    closeWindow () {
      ipc.send('window-close')
    },
    resize () {
      if (this.$refs) {
        let newVal = this.$refs['ffbRef'].clientWidth
        if (newVal > 1000) {
          this.cssConfig.fsiWidth = '10%'
        } else if (newVal > 750) {
          this.cssConfig.fsiWidth = '20%'
        } else if (newVal > 500) {
          this.cssConfig.fsiWidth = '25%'
        } else {
          this.cssConfig.fsiWidth = '100px'
        }
      }
    },
    getIcon (type) {
      switch (type) {
        case 'music':
          return 'icon-file_music'
        case 'doc':
          return 'icon-file_word'
        case 'img':
          return 'icon-file_img'
        case 'video':
          return 'icon-file_video'
        case 'dir':
          return 'icon-folder'
      }
    }
  }
}
</script>

<style lang="scss">
.file-system {
	background: white;
	user-select: none;

	i {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.1s ease-in-out;
	}

	.fs-header-box {
		height: calc(36px + 60px);
		background: linear-gradient(45deg, #007897, #aed4dd);
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
				font-size: 14px;
				letter-spacing: 2px;
			}

			.fs-frame-options {
				height: 100%;
				float: right;
				i {
					float: left;
					height: 20px;
					width: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12px;
					font-weight: bold;
					margin: 0 5px;
					transition: all 0.1s ease-in-out;

					&.icon-close {
						color: #ff5f56;
						background: #ff5f56;
					}
					&.icon-minus {
						color: #24ca3f;
						background: #24ca3f;
					}
					&.icon-stop {
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
			height: 60px;
			.fs-nav-option {
				height: 100%;
				width: 60px;
				color: #bbc4d5;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				float: left;

				i {
					height: 40px;
					width: 40px;
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
				width: calc(100% - 180px - 360px);
				display: flex;
				align-items: center;
				padding-left: 20px;
				.fs-nav-address-bar {
					height: 40px;
					width: 100%;
					min-width: 400px;
					border-radius: 20px;
					padding: 0 20px;
					background: #5b6682;
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
		}
	}

	.fs-content-box {
		height: calc(100% - 36px - 60px);
		.fs-shortcut-box {
			float: left;
			height: 100%;
			width: 200px;
			border-right: 1px solid #e4f1f4;
			background: linear-gradient(135deg, #b8e4ec, #f6f0ef);
			.fs-shortcut-item {
				display: flex;
				align-items: center;
				height: 32px;
				padding-left: 14px;
				&:hover {
					background: #e5f3ff;
				}
				.icon-ios-arrow-forward {
					opacity: 0;
					font-size: 14px;
					font-weight: bold;
					margin-right: 8px;
					transition: all 0.4s ease-in-out;
					&.unfold {
						transform: rotate(90deg);
					}
				}
			}
			.fs-shortcut-sub-item {
				font-size: 12px;
				letter-spacing: .4px;
				padding-left: calc(14px + 14px + 6px);
				.icon {
					margin-right: 6px;
				}
			}
			.fs-shortcut-title {
				height: 40px;
				font-size: 14px;
				padding-top: 8px;
				color: #303030;
				font-weight: bold;
				i {
					width: fit-content;
					float: left;
					margin-right: 6px;
				}
			}
			&:hover {
				.icon-ios-arrow-forward {
					opacity: 1;
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
