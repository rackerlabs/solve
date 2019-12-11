export default {
  methods: {
    formatDate(date) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${months[month]} ${day}, ${year}`;
    },
  },
};
