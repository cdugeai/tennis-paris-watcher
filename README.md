# Tennis Paris watcher

This project is a watcher for finding tennis courts in Paris according to your specific timeslots.

## Data origin

This data for tennis courts availability come from [paris.fr](https://tennis.paris.fr/tennis/jsp/site/Portal.jsp?page=tennisParisien&view=les_tennis_parisiens).

## Usage

Set your desired schedules in the [watch.yml](watch.yml) config file. This file will look like this:

```yaml
watch:
  unique:
    -   name: thursday_09
        enabled: true
        date: 09/06/2022
        time_start: 18
        time_end: 22
    -   name: friday_10
        enabled: true
        date: 10/06/2022
        time_start: 19
        time_end: 22
        inOut:
          - covered
          - not-covered
        coating:
          - Gazon synthétique
          - Résine
          - Terre battue
          - Béton poreux
          - Bitume
          - Synthétique
  recurrent:
    -   name: wednesday_noon
        enabled: true
        day: wednesday
        time_start: 11
        time_end: 14
        coating:
          - Résine
    - name: tuesday_night
      enabled: true
      day: tuesday
      time_start: 19
      time_end: 22

```

You can find the allowed values for `coating`, `inOut` in [this dictionnary](schedule_config/allowed_values.js).

Then, you should run `npm install` once to install all the dependencies.

When the dependencies are installed and the `watch.yml` file is ready, run:
```shell script
npm start
```

### Schedule types

As you can see in the [watch.yml](watch.yml), there are two type of schedules:

|Schedule type | Description| Allowed values|
|--- | ---|---|
| `unique` | This schedule is used to find available courts on a specific date. This date is defined by the attribute `date`. | Any date following this format `dd/mm/yyyy`|
| `recurrent` | This schedule is used to find availables courts on a weekly basis. If you specify `wednesday` as the value of the attribute `day`, the script is going to search for available courts on **next** wednesday.| See  [allowed values](schedule_config/allowed_values.js) |


The only difference between these two schedule are one attribute:
- `date` for *unique* schedule
- `day` for *recurrent* schedule
