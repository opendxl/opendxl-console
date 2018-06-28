//----------------------------------------------------------------------
// Isomorphic SmartClient
// Editable Server-Side DataSource example
//----------------------------------------------------------------------
package com.isomorphic.examples.server.editableServerSideDataSource;

import java.io.StringWriter;
import java.util.List;
import java.util.Map;

import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.datasource.DataSource;
import com.isomorphic.datasource.DynamicDSGenerator;
import com.isomorphic.log.Logger;
import com.isomorphic.xml.XML;

/**
 * GeneratorSetup.setupGenerator() is used by DMI, but it would be more typical
 * to do this during applications startup, for example, from a servlet where
 * <load-on-startup> has been set in web.xml
 */
public class GeneratorSetup {

	private static Logger log = new Logger(GeneratorSetup.class.getName());

	public void setupGenerator() {
		DataSource.addDynamicDSGenerator(new DynamicDSGenerator() {
			@SuppressWarnings("unchecked")
			@Override
			public DataSource getDataSource(String id, DSRequest dsRequest) {
				if ("dynamicDS".equals(id)) {
					try {
						StringWriter sw = new StringWriter();
						sw.write("<DataSource ID=\"dynamicDS\" titleField=\"name\">\n");
						sw.write("<fields>\n");
						// Construct datasource using dynamicDSFields data.
						DSRequest dsReq = new DSRequest("dynamicDSFields", "fetch");
						DSResponse dsResp = dsReq.execute();
						List<?> data = dsResp.getDataList();
						for (Object dateRow : data) {
							Map<String, ?> record = (Map<String, ?>) dateRow;
							XML.recordToXML("field", record, sw);
							sw.write("\n");
						}
						sw.write("</fields>\n");
						sw.write("</DataSource>");
						return DataSource.fromXML(sw.toString());
					} catch (Exception e) {
						log.error("Problems when creating dynamic server side datasource.", e);
					}
				}
				return null;
			}
		});
	}

}
