import Client from "../../types/Client";

export default (filter: string, array: Array<Client>) => {
  let filteredArr = [];
  array.forEach((client) => {
    let nameFilter = client.name ? client.name.toUpperCase().indexOf(filter.toUpperCase()) > -1 : false;
    let surnameFilter = client.surname ? client.surname.toUpperCase().indexOf(filter.toUpperCase()) > -1 : false;
    let phoneNumberFilter = client.phoneNumber ? client.phoneNumber.toUpperCase().indexOf(filter.toUpperCase()) > -1 : false;
    let peselFilter = client.pesel ? client.pesel.toUpperCase().indexOf(filter.toUpperCase()) > -1 : false;

    if (
      nameFilter ||
      surnameFilter ||
      phoneNumberFilter ||
      peselFilter
    ) {
      filteredArr.push(client);
    }
  });
  return filteredArr;
};
