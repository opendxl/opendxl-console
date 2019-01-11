from __future__ import absolute_import
import json

import logging
import tornado
import dxlconsole.util

from dxlconsole.handlers import BaseRequestHandler

logger = logging.getLogger(__name__)


class SubscriptionsHandler(BaseRequestHandler):
    """
    Handles requests for the subscriptions list including fetch, add, and remove.
    """

    def __init__(self, application, request, module):
        super(SubscriptionsHandler, self).__init__(application, request)
        self._module = module

    def data_received(self, chunk):
        pass

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        client_id = self.get_query_argument("clientId")

        if client_id == "null":
            self.write(dxlconsole.util.create_sc_error_response(
                "No client ID sent with request."))
            return

        client = self._module.get_dxl_client(str(client_id))

        response_wrapper = dxlconsole.util.create_sc_response_wrapper()

        response = response_wrapper["response"]

        if self.get_query_argument("_operationType") == "add":
            # add operations require an empty response?
            topic = str(self.get_query_argument("topic"))
            client.subscribe(topic)
        elif self.get_query_argument("_operationType") == "remove":
            # remove operations require an empty response?
            topic = str(self.get_query_argument("topic"))
            client.unsubscribe(topic)
        else:
            for subscription in client.subscriptions:
                # don't include the client response topic
                if "/mcafee/client" not in subscription:
                    subscription_entry = {'topic': subscription}
                    response["data"].append(subscription_entry)

            response["endRow"] = len(client.subscriptions) - 1
            response["totalRows"] = len(client.subscriptions) - 1

        logger.debug(
            "Subscription handler response: %s", json.dumps(response_wrapper))
        self.write(response_wrapper)
