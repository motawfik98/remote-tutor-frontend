<template>
  <div>
    <template>
      <v-navigation-drawer
          :permanent="$vuetify.breakpoint.mdAndUp"
          :expand-on-hover="$vuetify.breakpoint.mdAndUp"
          dark
          v-model="open"
          app
          clipped
      >
        <v-list>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="title">{{
                  (isLoggedIn) ? userData.name : "Hello Student"
                }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense rounded>
          <v-list-item-group v-model="selected">
            <v-list-item :to="{ name: 'Announcements' }">
              <v-list-item-icon>
                <v-icon>mdi-bullhorn</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Announcements</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Quizzes' }">
              <v-list-item-icon>
                <v-icon>mdi-head-question</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Quizzes</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Assignments' }">
              <v-list-item-icon>
                <v-icon>mdi-comment-question</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Assignments</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Grades' }">
              <v-list-item-icon>
                <v-icon>mdi-account-star</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Grades</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Students' }" v-if="userData.admin">
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Students</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Access' }" v-if="userData.admin">
              <v-list-item-icon>
                <v-icon>mdi-calendar-check</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Access</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Videos' }">
              <v-list-item-icon>
                <v-icon>mdi-video</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Lessons</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Classes' }" v-if="isLoggedIn">
              <v-list-item-icon>
                <v-icon>mdi-teach</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Classes</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'ResetPassword' }" v-if="isLoggedIn">
              <v-list-item-icon>
                <v-icon>mdi-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Change Password</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout" v-if="isLoggedIn">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>

      </v-navigation-drawer>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "Drawer",
  props: ["staticOpen"],
  data() {
    return {
      open: this.staticOpen || false,
      selected: 1,
    }
  },
  computed: {
    ...mapState(['userData', 'isLoggedIn'])
  },
  methods: {
    logout() {
      this.$store.dispatch("setUserData", {
        admin: false,
        name: '',
        token: ''
      })
      this.$store.dispatch("setIsLoggedIn", false)
      this.$store.dispatch("setUserClasses", [])
      this.$store.dispatch("setUserClass", 0)
      this.$router.push({name: 'Announcements'})
    }
  },
  watch: {
    staticOpen: function (val) {
      this.open = val
    },
    open: function (val) {
      this.$emit('closedDrawer', {
        value: val
      })
    }
  }
}
</script>