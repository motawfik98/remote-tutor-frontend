<template>
  <div>
    <v-app-bar color="black" dense dark app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="!$vuetify.breakpoint.mdAndUp"></v-app-bar-nav-icon>
      <v-avatar tile>
        <v-img :src="require('@/assets/logo.png')"></v-img>
      </v-avatar>

      <v-toolbar-title>{{ pageName }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tooltip bottom v-if="!userData.admin && isLoggedIn">
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on" @click="dialog = true">
            <v-icon>mdi-cash</v-icon>
          </v-btn>
        </template>
        <span>Payments</span>
      </v-tooltip>

      <v-menu left bottom v-if="isLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-teach</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(studentClass, index) in classes.values" :key="studentClass.hash"
                       @click="changeSelectedClass(index)">
            <v-list-item-title>
              <v-icon v-if="index === classes.selectedClass">mdi-check</v-icon>
              {{ studentClass.class.organization.subject }}
              (Mr. {{ studentClass.class.organization.teacherName }})
              {{ studentClass.class.name }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name: 'Classes'}">
            <v-list-item-title>View All</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn text v-else @click="() => this.loginDrawer = true">Login</v-btn>

    </v-app-bar>
    <LoginDrawer :static-open="loginDrawer" @closedDrawer="(options) => this.loginDrawer = options.value"></LoginDrawer>
    <Drawer :static-open="drawer" @closedDrawer="(options) => this.drawer = options.value"></Drawer>
    <Payment :student-name="userData.name" :dialog.sync="dialog"></Payment>
  </div>
</template>

<script>
import Drawer from "@/components/utils/Drawer";
import Payment from "@/components/payments/shared/Payment";
import {mapState} from "vuex";
import LoginDrawer from "@/components/utils/LoginDrawer";

export default {
  name: "AppBar",
  props: ["pageName"],
  components: {
    LoginDrawer,
    Drawer,
    Payment
  },
  computed: {
    ...mapState(['userData', 'classes', 'isLoggedIn'])
  },
  data() {
    return {
      drawer: false,
      dialog: false,
      loginDrawer: false,
    };
  },
  methods: {
    changeSelectedClass(index) {
      this.$store.dispatch('setUserClass', index)
    }
  },
}
</script>

<style scoped>

</style>