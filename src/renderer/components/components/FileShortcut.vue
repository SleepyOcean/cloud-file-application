<template>
	<div class="file-shortcut-item" :title="file.name">
		<div class="fsi-file-box">
			<div class="fsi-file-icon">
				<file-icon :name="getIcon(file.type)" v-if="file.category !== 'image' || !urlSuffix"></file-icon>
				<div class="fsi-image-box" v-if="file.category === 'image' && urlSuffix">
					<img :src="getImage()"></img>
				</div>
			</div>
			<div class="fsi-file-name">
				{{ file.name }}
			</div>
		</div>
	</div>
</template>

<script>
import FileIcon from './FileIcon';
export default {
	name: 'FileShortcut',
	components: {
		FileIcon
	},
	props: {
		file: {
			type: Object,
			default: () => {
				return {
					name: 'index.html',
					type: '.html'
				};
			}
		},
		urlSuffix: {
			type: String,
			default: ''
		}
	},
	methods: {
		getIcon (type) {
			switch (type) {
			case 'music':
			case '.mp3':
			case '.wav':
			case '.flac':
				return 'icon-file_music';
			case 'doc':
			case '.doc':
			case '.docx':
				return 'icon-file_word';
			case 'img':
			case '.png':
			case '.jpg':
			case '.jpeg':
				return 'icon-file_img';
			case 'video':
			case '.mp4':
			case '.mkv':
			case '.rmvb':
				return 'icon-file_video';
			case '.xml':
				return 'icon-file_code';
			case 'dir':
				return 'icon-folder';
			case '.html':
				return 'icon-file_html';
			case '.json':
			case '.txt':
			case '.logs':
				return 'icon-file_txt';
			case '.exe':
				return 'icon-file_exe';
			case '.bt':
				return 'icon-file_bt';
			case '.zip':
			case '.rar':
			case '.tar':
			case '.gz':
			case '.7z':
				return 'icon-file_zip';
			default:
				return 'icon-file_cloud';
			}
		},
		getImage () {
			return this.urlSuffix + encodeURIComponent(this.file.name) + '&ratio=0.2';
		}
	}
};
</script>

<style lang="scss">
.file-shortcut-item {
	width: 120px;
	height: 120px;
	float: left;
	padding: 10px;
	text-align: center;
	cursor: default;
	&:hover, &.active{
		.fsi-file-box {
			background: aliceblue;
		}
	}
	&.active .fsi-file-box {
		outline: 1px solid #9bbdf9;
	}
	.fsi-file-box {
		height: 100%;
	}
	.fsi-file-icon {
		height: calc(100% - 20px);
		font-size: 60px;
		.fsi-image-box {
			height: 100%;
			width: 100%;
			display: flex;
			padding: 5px;
			img {
				width: 100%;
				max-height: 100%;
				object-fit: contain;
			}
		}
	}
	.fsi-file-name {
		height: 20px;
		font-size: 12px;
		padding: 0 5px;
		letter-spacing: .4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		user-select: none;
	}
}
</style>
