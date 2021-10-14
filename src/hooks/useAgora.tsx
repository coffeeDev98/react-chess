import AgoraRTM, { RtmChannel, RtmClient, RtmTextMessage } from "agora-rtm-sdk";
import axios from "axios";
import { useEffect, useState } from "react";
declare let window: any;

const useAgora = () => {
  const [channel, setChannel] = useState<RtmChannel | null>(null);
  const appId = "f4b36b6c897e41bfaa3904d75da40777";
  const client: RtmClient | null = AgoraRTM.createInstance(appId);
  let playerMeta = {
    uid: (Math.floor(Math.random() * 90000) + 10000).toString(),
    token: "",
  };

  useEffect(() => {
    const playerLogin = async () => {
      axios
        .get(
          `https://agoratokenserver-demo.herokuapp.com/access_token?channel=test&uid=${playerMeta.uid}`
        )
        .then((res: any) => {
          console.log(res);
          playerMeta.token = res.data?.token || "";
          // console.log("LOGIN OPTIONS: ", playerMeta);
          client.login(playerMeta).then(() => {
            console.log("Login successful");
            const newChannel = client.createChannel("test");
            newChannel.join();
            setChannel(newChannel);
          });
        });
    };

    playerLogin().then(() => {
      console.log("integrations successful");
    });
  }, []);

  useEffect(() => {
    if (channel) {
      channel?.on("ChannelMessage", (message: any, memberId: any) => {
        const parsedTextMessage = JSON.parse(message.text);
        window.document
          .getElementById("chat-section")
          .appendChild(document.createElement("div"))
          .append(`${parsedTextMessage.uid}: ${parsedTextMessage.msg}`);
      });
      channel?.on("MemberJoined", function (memberId) {
        console.log("New member joined: ", memberId);
      });

      //   channel?.join();
    }
  }, [channel]);

  const sendMsgInChannel = (message: string) => {
    const textObject: {
      uid: string;
      msg: string;
    } = {
      uid: playerMeta.uid,
      msg: message,
    };
    const msgObject: RtmTextMessage = {
      text: JSON.stringify(textObject) || "",
      messageType: "TEXT",
    };
    channel?.sendMessage(msgObject).then(() => {
      window.document
        .getElementById("chat-section")
        .appendChild(document.createElement("div"))
        .append(`${playerMeta.uid}: ${textObject.msg}`);
    });
  };

  return { playerMeta, sendMsgInChannel };
};

export default useAgora;
