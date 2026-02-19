<template>
  <div id="maintenance">
    <div
      class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-4 MuiGrid-direction-xs-column css-1juhi5r"
    >
      <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-1osx3qj">
        <div class="MuiBox-root css-1gw2ue9">
          <img
            src="../assets/img/maintenance.png"
            alt="mantis"
            style="height: 420px; width: 490px"
          />
        </div>
      </div>
      <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-1osx3qj">
        <div class="MuiStack-root css-j9or8v">
          <h1
            class="MuiTypography-root MuiTypography-h1 MuiTypography-alignCenter css-ojo0um"
          >
            Технические работы
          </h1>
          <p
            class="MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter css-1qfhhhy"
          >
            Что-то новое уже на подходе
          </p>
        </div>
      </div>
      <div
        class="!hidden MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-194lolc"
      >
        <div class="MuiStack-root css-zrxy8y">
          <div
            class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1kdryfj"
          >
            <div class="MuiStack-root css-wkpw2c">
              <div class="MuiBox-root css-1lsg2gy">
                <h2 class="MuiTypography-root MuiTypography-h2 css-eb60i0">
                  {{ hours !== null ? hours : 7 }}
                </h2>
              </div>
              <div class="MuiBox-root css-1ju4nb1">
                <h6
                  class="MuiTypography-root MuiTypography-subtitle2 MuiTypography-alignCenter css-1j0m3zx"
                >
                  час
                </h6>
              </div>
            </div>
          </div>
          <h1 class="MuiTypography-root MuiTypography-h1 css-hyas57">:</h1>
          <div
            class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1kdryfj"
          >
            <div class="MuiStack-root css-wkpw2c">
              <div class="MuiBox-root css-1lsg2gy">
                <h2 class="MuiTypography-root MuiTypography-h2 css-eb60i0">
                  {{ minutes !== null ? minutes : 56 }}
                </h2>
              </div>
              <div class="MuiBox-root css-1ju4nb1">
                <h6
                  class="MuiTypography-root MuiTypography-subtitle2 MuiTypography-alignCenter css-1j0m3zx"
                >
                  мин
                </h6>
              </div>
            </div>
          </div>
          <h1 class="MuiTypography-root MuiTypography-h1 css-hyas57">:</h1>
          <div
            class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1kdryfj"
          >
            <div class="MuiStack-root css-wkpw2c">
              <div class="MuiBox-root css-1lsg2gy">
                <h2 class="MuiTypography-root MuiTypography-h2 css-eb60i0">
                  {{ seconds !== null ? seconds : 53 }}
                </h2>
              </div>
              <div class="MuiBox-root css-1ju4nb1">
                <h6
                  class="MuiTypography-root MuiTypography-subtitle2 MuiTypography-alignCenter css-1j0m3zx"
                >
                  сек
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-194lolc">
        <vue-countdown
          v-slot="{ hours, minutes, seconds }"
          class="block"
          :time="miliseconds"
        >
          <div class="MuiStack-root css-zrxy8y">
            <div
              class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1kdryfj"
            >
              <div class="MuiStack-root css-wkpw2c">
                <div class="MuiBox-root css-1lsg2gy">
                  <h2 class="MuiTypography-root MuiTypography-h2 css-eb60i0">
                    {{ hours < 10 ? "0" + hours : hours }}
                  </h2>
                </div>
                <div class="MuiBox-root css-1ju4nb1">
                  <h6
                    class="MuiTypography-root MuiTypography-subtitle2 MuiTypography-alignCenter css-1j0m3zx"
                  >
                    час
                  </h6>
                </div>
              </div>
            </div>
            <h1 class="MuiTypography-root MuiTypography-h1 css-hyas57">:</h1>
            <div
              class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1kdryfj"
            >
              <div class="MuiStack-root css-wkpw2c">
                <div class="MuiBox-root css-1lsg2gy">
                  <h2 class="MuiTypography-root MuiTypography-h2 css-eb60i0">
                    {{ minutes < 10 ? "0" + minutes : minutes }}
                  </h2>
                </div>
                <div class="MuiBox-root css-1ju4nb1">
                  <h6
                    class="MuiTypography-root MuiTypography-subtitle2 MuiTypography-alignCenter css-1j0m3zx"
                  >
                    мин
                  </h6>
                </div>
              </div>
            </div>
            <h1 class="MuiTypography-root MuiTypography-h1 css-hyas57">:</h1>
            <div
              class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1kdryfj"
            >
              <div class="MuiStack-root css-wkpw2c">
                <div class="MuiBox-root css-1lsg2gy">
                  <h2 class="MuiTypography-root MuiTypography-h2 css-eb60i0">
                    {{ seconds < 10 ? "0" + seconds : seconds }}
                  </h2>
                </div>
                <div class="MuiBox-root css-1ju4nb1">
                  <h6
                    class="MuiTypography-root MuiTypography-subtitle2 MuiTypography-alignCenter css-1j0m3zx"
                  >
                    сек
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </vue-countdown>
      </div>
      <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-1vmk0tc">
        <div class="MuiStack-root css-tp5b2c">
          <p
            class="MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter css-1qfhhhy"
          >
            Мы автоматически перенаправим Вас на сайт, как только
          </p>
          <p
            class="MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter css-1qfhhhy"
          >
            завершим технические работы
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from "@/services/API";
import "@/assets/maintenance.css";

export default {
  data() {
    return {
      arrival_timestamp: null,
      secondsLeft: null,
      timer: null,
      miliseconds: null,
    };
  },
  watch: {
    secondsLeft(time) {
      if (time <= 0) {
        this.stopTimer();
        this.$router.push("/");
      }
    },
  },
  async created() {
    await API.apiClient
      .get(`/users/auth`)
      .then((response) => {
        console.log(response);
        this.secondsLeft = 900;
        if (response.status === 200) {
          this.$router.push("/");
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.router.push("/login");
        }
        this.secondsLeft = error.response.data.seconds;
        this.arrival_timestamp = error.response.data.arrival_timestamp;
        this.miliseconds = error.response.data.seconds * 1000;
      });
  },
  mounted() {
    this.startTimer();
  },
  unmounted() {
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.secondsLeft--;
      }, 1000);
    },
    stopTimer() {
      clearTimeout(this.timer);
    },
    addLeadingZeros(value) {
      if (value < 10) {
        value = "0" + value;
      }
      return value;
    },
  },
};
</script>
