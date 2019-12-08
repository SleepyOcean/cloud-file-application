<template>
	<div class="file-shortcut-item" :title="file.name">
		<div class="fsi-file-icon">
			<file-icon :name="getIcon(file.type)"></file-icon>
		</div>
		<div class="fsi-file-name">
			{{ file.name }}
		</div>
	</div>
</template>

<script>
import FileIcon from './FileIcon'
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
        }
      }
    }
  },
  methods: {
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
        case '.html':
          return 'icon-file_html'
        case '.json':
          return 'icon-file_txt'
        case '.mp4':
          return 'icon-file_video'
        case '.png':
          return 'icon-file_img'
      }
    }
  }
}
</script>

<style lang="scss">
.file-shortcut-item {
	float: left;
	padding: 10px 20px;
	&:hover{
		background: aliceblue;
	}
	.fsi-file-icon {
		font-size: 60px;
	}
	.fsi-file-name {
		font-size: 14px;
		letter-spacing: .4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
