<script setup>
import axios from 'axios';

const CHATGPT_API_KEY = "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";

export async function requestChatAPI(testInput: String) {
  const prompt = `命令書
あなたはプロの編集者です。以下の制約条件に従って、入力する文章を要約してください。

制約条件
・重要なキーワードを取りこぼさない。
・文章の意味を変更しない。
・架空の表現や言葉を使用しない。
・入力する文章を句読点を含めて100文字以内にまとめて出力。
・要約した文章の句読点を含めた文字数を出力。
・文章中の数値には変更を加えない。
  `;

  //TODO
  console.log("動作が走りました");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CHATGPT_API_KEY}`,
  };

  const messages = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: `入力文章を指定された文字数の範囲内に要約してください。要約された文章が文字数が範囲内に収まっていない場合には、文字を追加または削除する処理を繰り返します。/
      - 入力文章: ${testInput} /
      - 文字数の下限:80
      - 文字数の上限:100`,
    }
  ];

  const payload = {
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
    messages: messages,
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      payload,
      {
        headers: headers,
      }
    );
    console.log("結果が返ってきました");
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    alert("エラーが発生しました。再リロードしてください");
    throw error; // Re-throw the error so it can be handled in the calling code
  }
}
</script>
