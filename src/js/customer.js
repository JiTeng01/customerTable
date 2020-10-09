import axios from "axios";
import config from "@/js/config.js";
export default {
  data: () => ({
    selected: null,
    Birthdate: null,
    menu: false,
    dialog: false,
    headers: [
      { text: "Firstname", value: "Firstname" },
      { text: "Lastname", value: "Lastname" },
      { text: "Gender", value: "Gender" },
      { text: "Birthdate", value: "Birthdate" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    customers: [],
    editedIndex: -1,
    editedItem: {
      Firstname: "",
      Lastname: "",
      Gender: "",
      Birthdate: "",
    },
    defaultItem: {
      Firstname: "",
      Lastname: "",
      Gender: "",
      Birthdate: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      console.log(config.api.invokeUrl);
      axios
        .get(config.api.invokeUrl + "/customerlist")
        .then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.customers.push({
              id: response.data[i].id,
              Firstname: response.data[i].firstname,
              Lastname: response.data[i].lastname,
              Gender: response.data[i].gender,
              Birthdate: response.data[i].birthDate,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
        console.log(this.customers)
    },

    editItem(item) {
      this.Birthdate = item.Birthdate;
      this.selected = item.Gender;
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.formTitle == "New Customer") {
        axios
          .post(config.api.invokeUrl + "/addcustomer", {
            firstName: this.$refs.firstname.value,
            lastName: this.$refs.lastname.value,
            gender: this.selected,
            birthDate: this.Birthdate,
          })
          .then(function(response) {
            alert(response.data);
            location.reload();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        axios
          .put(config.api.invokeUrl + "/updatecustomer", {
            id: this.editedIndex,
            firstName: this.$refs.firstname.value,
            lastName: this.$refs.lastname.value,
            gender: this.selected,
            birthDate: this.Birthdate,
          })
          .then(function(response) {
            alert(response.data);
            location.reload();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },

    saveDate(Birthdate) {
      this.$refs.menu.save(Birthdate);
    },
  },
};
