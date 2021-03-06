<template>
  <v-app>
    <AppBar page-name="Videos"></AppBar>
    <v-main>
      <v-container>
        <v-row v-if="userData.admin">
          <div>Please note that the video will be created with the chosen settings (Year, Selected Day, and Title)</div>
        </v-row>
        <ValidationObserver ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="createVideo">
            <v-row>
              <v-col cols="12" md="3" v-if="userData.admin">
                <v-row>
                  <v-col>
                    <v-date-picker v-model="date" full-width first-day-of-week="5"
                                   :picker-date.sync="pickedMonth"></v-date-picker>
                  </v-col>
                </v-row>
                <ValidationProvider v-slot="{errors}" rules="required">
                  <v-row>
                    <v-text-field
                        label="Title"
                        v-model.trim="newVideoTitle"
                        prepend-icon="mdi-format-text"
                        :error-messages="errors"
                        counter>
                    </v-text-field>
                  </v-row>
                </ValidationProvider>
                <ValidationProvider v-slot="{errors}" rules="required|numeric|min_value:1">
                  <v-row>
                    <v-text-field
                        label="Hours to Watch / Part"
                        v-model.number="newVideoAvailableTime"
                        :error-messages="errors"
                        prepend-icon="mdi-timer-outline">
                    </v-text-field>
                  </v-row>
                </ValidationProvider>
                <v-row>
                  <v-btn color="primary" @click="createVideo" block :loading="createLoading"
                         :disabled="invalid">Create Video
                  </v-btn>
                </v-row>
              </v-col>
              <v-col cols="12" md="3" v-else>
                <v-date-picker
                    v-model="pickedMonth"
                    type="month"
                ></v-date-picker>
              </v-col>
              <v-col>
                <v-row v-if="userData.admin">
                  <AdminVideoCard
                      v-for="(video, index) in videos"
                      :key="video.ID"
                      :index="index + 1"
                      :video="video"
                      @videoUpdated="getVideos"
                      @videoDeleted="getVideos"
                  ></AdminVideoCard>
                </v-row>
                <v-row v-else>
                  <UserVideoCard
                      v-for="(video, index) in videos"
                      :key="video.ID"
                      :index="index + 1"
                      :video="video"
                  ></UserVideoCard>
                </v-row>
              </v-col>
            </v-row>
          </form>
        </ValidationObserver>
      </v-container>
    </v-main>

    <v-dialog v-model="dialog" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import AppBar from "@/components/utils/AppBar";
import {mapState} from "vuex";
import api from "@/gateways/api";
import AdminVideoCard from "@/components/videos/admins/VideoCard";
import UserVideoCard from "@/components/videos/users/VideoCard";
import static_videos from "@/static-data/videos.json"

export default {
  name: "Videos",
  components: {AdminVideoCard, UserVideoCard, AppBar},
  computed: {
    ...mapState(['userData', 'classes', 'isLoggedIn']),
    selectedClass() {
      return this.classes.values[this.classes.selectedClass].classHash
    },
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      newVideoTitle: '',
      newVideoAvailableTime: 3,
      pickedMonth: new Date().toISOString().substr(0, 7),
      createLoading: false,
      videos: [],
      dialog: false,
    }
  },
  methods: {
    getVideos() {
      if (this.isLoggedIn) {
        this.dialog = true
        api({
          method: "GET",
          url: "/videos",
          params: {
            date: new Date(this.pickedMonth).getTime(),
          }
        }).then(response => {
          this.videos = response.data.videos
        }).finally(() => {
          this.dialog = false
        })
      } else {
        this.videos = static_videos
      }
    },
    createVideo() {
      this.createLoading = true
      let formData = new FormData()
      formData.append("selectedClass", this.selectedClass)
      formData.append("availableFrom", new Date(this.date).getTime())
      formData.append("title", this.newVideoTitle)
      formData.append("studentTime", this.newVideoAvailableTime)
      api({
        method: "POST",
        url: "/admin/videos",
        data: formData,
      }).then(response => {
        this.$router.push({name: 'ViewVideo', params: {videoHash: response.data.video.hash}})
      }).finally(() => {
        this.createLoading = false
      })
    }
  },
  mounted() {
    this.getVideos()
  },
  watch: {
    pickedMonth() {
      this.getVideos()
    },
    classes: {
      handler() {
        this.getVideos()
      },
      deep: true
    },
  },
}
</script>

<style scoped>

</style>