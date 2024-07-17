# Crud-master

## Project Description

3 VMs connected to eachother via REST, CRUD APIs.

Gateway VM: IP 192.168.56.101 # Entry point to the microservices, handles incoming data connections

Inventory VM: IP 192.168.56.103 # Handles Movies Database and incoming data connections.

Billing VM: IP 192.168.56.102 # Handles Orders Database and incoming data connections.

If Gateway VM receives a post request about adding/deleting/updating data about a new movie on IP:/api/movies the connections gets forwarded to the Inventory VM to handle it.

If Gateway VM receis a post request about billing, it gets queued via RabbidMQ and if the billing server is up and running, the server will consume the request from the queue. If the server is down, the queue will pile up and consume the queue if the Billing VM comes up.

## Table of Contents

- [How to run](#howtorun)
- [Audit](#audit)
- [Video](#videos)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Authors](#authors)

## How to run

Have Vagrant, Postman and VirtualBox installed

Git clone the project, cd inside it and run

```python
vagrant up
```

Wait 5-10m until Vagrant loads all 3 VMs, runs all the scrips to install all the dependencies, generates the databases etc.

Open Postman and query the Gateway database with beforementioned APIs as seen in the video.

## Audit

To audit the program, follow the steps [here](https://github.com/01-edu/public/tree/master/subjects/devops/crud-master/audit).

## Project Videos

Video1: https://youtu.be/bdiaenei95k

## Contributing

We welcome contributions! Please contact one of the authors in discord if you would like to contribute to future projects.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for details.

## Contact

For any questions or suggestions, feel free to contact us directly at `Kood / Jõhvi Discord`.

## Authors

_Authors: [Jaanus Saar](https://01.kood.tech/git/jsaar)_
