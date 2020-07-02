<template>
  <div class="hello">
    <h1>S3 Uploader Test</h1>

    <div v-if="!image">
      <h2>Select a file</h2>
      <input type="file" @change="onFileChange" />
    </div>
    <div v-else>
      <div v-if="isImage">
        <img :src="image" />
      </div>

      <div v-else>
        <p>Document ready to upload</p>
      </div>

      <button v-if="!uploadURL" @click="removeImage">Remove file</button>
      <button v-if="!uploadURL" @click="uploadImage">Upload file</button>
    </div>
    <h2 v-if="uploadURL">Success! Uploaded to:</h2>
    <a :href="uploadURL">{{ uploadURL }}</a>
  </div>
</template>

<script>
const config = {
  url: `YOUR_URL`
};

const MAX_FILE_SIZE = 1000000;
export default {
  name: "s3uploader",
  data() {
    return {
      image: "",
      uploadURL: "",
      type: ""
    };
  },

  computed: {
    isImage: function() {
      return this.type.includes("image");
    }
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },

    createImage(file) {
      this.type = file.type;
      let reader = new FileReader();
      reader.onload = e => {
        if (e.target.result.length > MAX_FILE_SIZE) {
          return alert("File is loo large - 1Mb maximum");
        }
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeImage: function() {
      this.image = "";
    },

    uploadImage: async function() {
      // 1. Get the presigned URL
      const res = await fetch(config.url, {
        method: "POST",
        body: JSON.stringify({
          type: this.type
        })
      });

      const response = await res.json();

      // 2. Create Data
      let binary = atob(this.image.split(",")[1]);
      let array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blobData = new Blob([new Uint8Array(array)], { type: this.type });

      // 3. Upload it to S3 with presigned url
      await fetch(response.uploadURL, {
        method: "PUT",
        body: blobData
      });

      // Final URL for the user doesn't need the query string params
      this.uploadURL = response.uploadURL.split("?")[0];
    }
  }
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#app {
  text-align: center;
}

img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
</style>