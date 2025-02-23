document$.subscribe(function () {

  const mdContentElement = document.querySelector('.md-content');

  if (!mdContentElement) return;

  let content = mdContentElement.innerHTML;

  content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  const replacements = [
    {
      name: "Channels",
      regex: /<#(\d+)>/g,
      replacer: (match, channelId) =>
        `<a href='https://discord.com/channels/331847112486551552/${channelId}' target='_blank'>#${channelId}</a>`
    },
    {
      name: "Emojis",
      regex: /<:(.*?):(\d+)>/g,
      replacer: (match, emojiName, emojiId) =>
        `<img src='https://cdn.discordapp.com/emojis/${emojiId}.png' alt='${emojiName}' width='16px'>`
    }
  ];

  for (const { regex, replacer } of replacements) {
    content = content.replace(regex, replacer);
  }

  mdContentElement.innerHTML = content;

});
