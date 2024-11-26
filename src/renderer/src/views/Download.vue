<template>
  <div class="box">
    <a-alert message="Video được lưu trữ trong thư mục Tải xuống của máy tính" type="info" show-icon>
      <template #action>
        <a-button size="small" @click="openLocalFile">Mở thư mục tải xuống</a-button>
      </template>
    </a-alert>
    <div class="form-box">
      <a-form layout="inline" style="justify-content: space-between">
        <a-form-item label="Đặt tiền tố">
          <a-input
            v-model:value="savePrefix"
            :maxlength="10"
            style="width: 150px"
            allowClear
            showCount
          />
        </a-form-item>
        <div class="btn-box">
          <a-button type="primary" danger @click="pasteParams">
            Dán và phân tích
          </a-button>
          <a-button type="primary" danger @click="handleSingleVideo">
            Liên kết đơn
          </a-button>
          <a-button type="primary" @click="download(0)">Tải xuống một</a-button>
          <a-button type="primary" @click="download(1)">Tải xuống hai</a-button>
        </div>
      </a-form>
    </div>

    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Tải xuống tham số">
        <a-textarea
          id="ParamsTextArea"
          v-model:value="params"
          placeholder="Vui lòng nhập tham số tải xuống"
          spellcheck="false"
          class="params"
          :rows="22"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Ý kiến ​​liên quan" force-render>
        <a-list :data-source="descs" :locale="{ emptyText: 'Không có nội dung' }">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <a-textarea :id="`inputDom${index}`" :value="item" />
              <template #actions>
                <a key="list-loadmore-more"
                  ><CopyOutlined @click="copyComment(index)"
                /></a>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div class="footer">2023 © GGBond</div>
</template>

<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
import { CopyOutlined } from "@ant-design/icons-vue";
import { useIpcRenderer } from "@vueuse/electron";

const ipcRenderer = useIpcRenderer();
const savePrefix = ref("下载");
const params = ref("");
const descs = ref([]);
const activeKey = ref("1");

// 通知主进程打开系统下载文件夹
const openLocalFile = () => {
  ipcRenderer.send("open-file");
};

// 粘贴功能
const pasteParams = () => {
  const dom = document.getElementById("ParamsTextArea");
  dom.value = "";
  dom.focus();
  document.execCommand("paste");
};

// 复制功能
const copyComment = (index) => {
  const inputElement = document.getElementById(`inputDom${index}`);
  inputElement.select();
  inputElement.setSelectionRange(0, 99999); // 为了兼容不同浏览器
  document.execCommand("copy");
  inputElement.setSelectionRange(0, 0);
  message.success("复制成功");
};

// 解析参数
async function parseParams(type = "video") {
  try {
    const values = [];
    const parsedJson = JSON.parse(params.value);
    if (type === "video") {
      parsedJson?.forEach((videoItem) => {
        values.push(videoItem?.item?.video?.play_addr?.url_list);
      });
    } else {
      parsedJson?.forEach((videoItem) => {
        values.push(videoItem?.item?.desc);
      });
    }
    return values;
  } catch (error) {
    console.error(error);
    message.error("Lỗi phân tích tham số, vui lòng kiểm tra các tham số tải xuống của đầu vào");
  }
}

// 获取指定urls
async function getDownloadUrl(videoUrlArray, index) {
  if (videoUrlArray[0]?.length - 1 < index) {
    return [];
  }
  return videoUrlArray.map((item) => {
    return item[index];
  });
}

// 通知主进程下载视频
function notificationMain(urls) {
  urls.forEach((url) => {
    const randomName = Math.random().toString().slice(-12);
    ipcRenderer.send("window-new", {
      videoUrl: url,
      videoName: `${savePrefix.value}-${randomName}.mp4`,
    }); // 向主进程通信
  });
}

// 直接输入视频链接，进行解析
function handleSingleVideo() {
  // 使用正则表达式匹配19位数字
  const pattern = /\b\d{19}\b/g;
  const matches = params.value?.match(pattern);
  if (!matches?.length) {
    message.error("Lỗi phân tích địa chỉ video");
    return;
  }
  const url = `https://www.douyin.com/aweme/v1/web/aweme/detail?aweme_id=${matches[0]}&screen_width=1920&screen_height=1080`
  ipcRenderer.send("handle-get-video-link", {
    videoLinkUrl: url,
    videoLinkId: matches[0],
  });
}

/**
 * 主函数
 * @param {*} index
 */
const download = async (index = 0) => {
  if (!params.value) {
    message.error("请输入参数");
    return;
  }

  const videoUrls = await parseParams("video");
  descs.value = await parseParams("desc");

  const urls = await getDownloadUrl(videoUrls, index);
  if (urls?.length < 1) {
    message.error("Nhận lỗi URL video");
  }
  notificationMain(urls);
};

// 接收主进程的下载状态通知进行提示
ipcRenderer.on("download-video-status", function (event, info) {
  if (info?.status === "success") {
    message.success(`${info.name}Tải xuống thành công`);
  } else {
    message.error(`${info.name}Tải xuống không thành công, vui lòng thử thay đổi kênh tải xuống`);
  }
});

// 接收主进程的下载状态通知进行提示
ipcRenderer.on("download-video-params", function (event, params2) {
  params.value = params2;
  message.success('Phân tích thành công một địa chỉ video duy nhất');
});
</script>

<style>
body {
  height: auto !important;
}

::-webkit-scrollbar {
  width: 10px;
  height: 20px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(201, 205, 212);
}

#ParamsTextArea,
.ant-spin-container {
  height: calc(100vh - 250px) !important;
  overflow-y: auto;
}

.ant-list-item-action {
  margin-inline-start: 20px !important;
}

.ant-list-item {
  padding: 12px 14px 12px 0 !important;
}
</style>

<style scoped>
.box {
  max-width: 650px;
  margin: 35px auto 10px;
}

.form-box {
  text-align: right;
  margin: 30px 0 15px;
}

.btn-box button {
  margin-left: 10px;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #3c3c3cb3;
}
</style>
