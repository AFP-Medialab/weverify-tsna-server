export function countInsta(data) {
  let tot_interactions = 0;
  let tot_comments = 0;
  let tot_likes = 0;
  for (let index in data) {
    if (typeof data[index].total_interactions === "string") {
      tot_interactions += parseInt(
        data[index].total_interactions.replace(/,/g, "")
      );
    } else {
      tot_interactions += data[index].total_interactions;
    }
    tot_comments += data[index].comments;
    tot_likes += data[index].likes;
  }

  const instaCount = {};
  instaCount.count = data.length;
  instaCount.total_interactions = tot_interactions;
  instaCount.likes = tot_likes;
  instaCount.comments = tot_comments;
  return instaCount;
};
