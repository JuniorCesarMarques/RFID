import { Audio, AVPlaybackStatus } from "expo-av";

let sound: Audio.Sound | null = null;

export async function playBeep() {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/beep.mp3"),
    );
    sound = newSound;
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if ("didJustFinish" in status && status.didJustFinish) {
        sound?.unloadAsync();
        sound = null;
      }
    });
  } catch (err) {
    // console.log("Erro ao tocar beep:", err);
  }
}

export async function stopBeep() {
  try {
    if (!sound) return;
    await sound.stopAsync();
    await sound.unloadAsync();
  } catch (err) {
    console.log(err)
  }finally {
    sound = null;
  }
}
