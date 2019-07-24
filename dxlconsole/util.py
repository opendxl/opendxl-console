# A default SmartClient JSON response to show no results
NO_RESULT_JSON = u"""{response:{status:0,startRow:0,endRow:0,totalRows:0,data:[]}}"""


def create_sc_response_wrapper():
    """
    Creates a wrapper object containing the standard fields required by SmartClient responses

    :return: an initial SmartClient response wrapper
    """
    response_wrapper = {"response": {}}
    response = response_wrapper["response"]
    response["status"] = 0
    response["startRow"] = 0
    response["endRow"] = 0
    response["totalRows"] = 0
    response["data"] = []
    return response_wrapper


def create_sc_error_response(error_message):
    """
    Creates an error response for the SmartClient UI with the given message

    :param error_message: The error message
    :return: The SmartClient response in dict form
    """
    response_wrapper = create_sc_response_wrapper()
    response = response_wrapper["response"]
    response["status"] = -1
    response["data"] = error_message
    return response


def create_broker_list_from_config(config_parser, section):
    """
    Method to create a broker list with data from the config for the
    specified section (ie either Brokers or BrokersWebSockets).

    :param config_parser: The config parser
    :param section: The section of the config to read
    data from (ie either Brokers or BrokersWebSockets)
    :return: A broker list populated with data from the
    specified section in the config
    """
    broker_list = []
    if config_parser.has_section(section):
        for name, value in config_parser.items(section):
            # split the value on ";". format is guid;port;host;ip
            _, port, host, ip_address = value.split(';')
            broker = {"hostName": host, "port": int(port), "guid": name, "ipAddress": ip_address}
            broker_list.append(broker)
    return broker_list
