export const getStatusColor = (status : string) => {
    switch(status) {
      case 'Paid':
        return {text: 'text-success', btn: 'btn-success'};
      case 'Pending':
        return {text: 'text-danger', btn: 'btn-danger'};
      default:
        return {text: 'text-warning', btn: 'btn-warning'}; // Default color if no match
    }
  };