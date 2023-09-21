import csv, sqlite3

def main():
    con = sqlite3.connect('cities500.db')
    cur = con.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS geonames (
                geonameid INTEGER PRIMARY KEY,
                name TEXT,
                asciiname TEXT,
                alternatenames TEXT,
                latitude REAL,
                longitude REAL,
                feature_code TEXT,
                country_code TEXT,
                admin1_code TEXT,
                population INTEGER,
                timezone TEXT,
                admin1 TEXT,
                country TEXT
            );''')

    states = {}
    with open('admin1CodesASCII.txt','r') as states_csv:
        reader = csv.DictReader(states_csv, fieldnames=['code', 'name', 'name_ascii', 'geonameid'], delimiter='\t')
        for row in reader:
            states[row['code']] = row['name']

    countries = {}
    with open('countryInfo.txt','r') as countries_csv:
        reader = csv.DictReader(countries_csv, delimiter='\t')
        for row in reader:
            countries[row['ISO']] = row['Country']

    with open('cities500.txt','r') as cities_csv:
        city_fieldnames = [
            'geonameid',
            'name',
            'asciiname',
            'alternatenames',
            'latitude',
            'longitude',
            'feature_class',
            'feature_code',
            'country_code',
            'cc2',
            'admin1_code',
            'admin2_code',
            'admin3_code',
            'admin4_code',
            'population',
            'elevation',
            'dem',
            'timezone',
            'modification_date'
        ]
        cities_reader = csv.DictReader(cities_csv, fieldnames=city_fieldnames, delimiter='\t')

        for row in cities_reader:
            state_code = f"{row['country_code']}.{row['admin1_code']}"
            # None becomes NULL in SQLite
            row['admin1'] = states.get(state_code, None)
            row['country'] = countries.get(row['country_code'], None)
            cur.execute("INSERT INTO geonames VALUES (:geonameid, :name, :asciiname, :alternatenames, :latitude, :longitude, :feature_code, :country_code, :admin1_code, :population, :timezone, :admin1, :country);", row)

    con.commit()
    con.close()

if __name__ == '__main__':
    main()
