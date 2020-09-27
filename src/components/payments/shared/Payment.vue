<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="() => $emit('update:dialog', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Payments</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="updatePayments" v-if="userData.admin">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title>
          {{ studentName }}

          <v-spacer></v-spacer>
          <v-col cols="6" sm="3">
            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="date"
                    label="Month"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="date"
                  type="month"
                  no-title
                  scrollable>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="saveMonth">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>

        </v-card-title>

        <v-data-table
            :headers="headers"
            :items="weeks"
            disable-sort
            class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-simple-checkbox v-model="item.status" :ripple="false" :disabled="!userData.admin"></v-simple-checkbox>
          </template>

        </v-data-table>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please wait...
          <v-progress-linear indeterminate color="white"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>
import api from "@/gateways/api";
import {mapState} from "vuex";

export default {
  name: "Payment",
  props: ['dialog', 'studentName', "userID"],
  data() {
    return {
      headers: [
        {text: 'From', value: 'from',},
        {text: 'To', value: 'to'},
        {text: 'Status', value: 'status',},
      ],
      weeks: [],
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      loadingDialog: false,
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  methods: {
    saveMonth() {
      this.$refs.menu.save(this.date)
      this.initializeWeeks()
    },
    initializeWeeks() {
      let friday = this.getFirstFriday()
      let selectedMonth = friday.getMonth()
      this.weeks = []
      while (friday.getMonth() === selectedMonth) {
        let startOfWeek = friday.toISOString().substr(0, 10)
        friday.setDate(friday.getDate() + 7)
        let endOfWeek = friday.toISOString().substr(0, 10)
        this.weeks.push({
          from: startOfWeek,
          to: endOfWeek,
          status: false,
          ID: -1
        })
      }
      this.getPayments().then(response => {
        response.forEach(payment => {
          this.weeks.forEach((week, index) => {
            if (new Date(week.from).setHours(0, 0, 0, 0) ===
                new Date(payment.startDate).setHours(0, 0, 0, 0)) {
              this.weeks[index].status = true
              this.weeks[index].ID = payment.ID
            }
          })
        })
      })
    },
    getFirstFriday() {
      let firstFriday = new Date(this.date)
      firstFriday.setDate(firstFriday.getDate() + (5 + 7 - firstFriday.getDay()) % 7)
      return firstFriday
    },

    getPayments() {
      let startDate = new Date(this.weeks[0].from).getTime()
      let endDate = new Date(this.weeks[this.weeks.length - 1].to).getTime()

      return api({
        method: "GET",
        url: "/payments/month",
        params: {
          userID: this.userID,
          startDate: startDate,
          endDate: endDate,
        }
      }).then(response => {
        return response.data.payments
      })
    },
    updatePayments() {
      this.loadingDialog = true
      let paymentsToPush = []
      this.weeks.forEach(week => {
        paymentsToPush.push(this.pushPayment(week))
      })
      Promise.all(paymentsToPush).then(() => {
        this.$emit('update:dialog', false)
        this.$store.dispatch('viewSnackbar', {
          text: "Payments updates successfully",
          color: "success"
        })
      }).catch(() => {
        this.$store.dispatch('viewSnackbar', {
          text: "An error occurred while trying to update the payments",
          color: "error"
        })
      }).finally(() => {
        this.loadingDialog = false
      })
    },
    pushPayment(week) {
      let method = ""
      if (week.ID === -1 && week.status)
        method = "POST"
      else if (week.ID !== -1 && !week.status)
        method = "DELETE"
      if (method !== "") {
        let formData = new FormData()
        formData.append("id", week.ID)
        formData.append("userID", this.userID)
        formData.append("startDate", new Date(week.from).getTime())
        formData.append("endDate", new Date(week.to).getTime())
        return api({
          method: method,
          url: "/admin/payments",
          data: formData
        })
      }
    }
  },
  watch: {
    dialog(val) {
      if (val)
        this.initializeWeeks()
    }
  }
}
</script>

<style scoped>

</style>