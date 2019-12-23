<template>
	<div class="file-shortcut-item" :title="file.name">
		<div class="fsi-file-box">
			<div class="fsi-file-icon">
				<file-icon :name="getIcon(file.type)"></file-icon>
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
		}
	},
	methods: {
		getIcon (type) {
			switch (type) {
			case 'music':
			case '.mp3':
			case '.wmv':
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
				return 'icon-file';
			}
		}
	}
};
</script>

<style lang="scss">
.file-shortcut-item {
	width: 120px;
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
	.fsi-file-icon {
		font-size: 60px;
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
