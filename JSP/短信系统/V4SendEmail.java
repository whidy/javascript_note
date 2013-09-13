package com.selleck.common.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.PasswordAuthentication;

public class V4SendEmail {
    
    
    /**
	 * 发送邮件（带附件）
	 * 
	 * @param mailName
	 *            附件地址
	 * @param subjectName
	 *            主题
	 * @param recipients
	 *            收件人的地址
	 * @param content
	 *            邮件正文
	 * @param send
	 *            //发件人邮箱
	 * @param mailFrom
	 *            用户名
	 * @param pwd
	 *            密码
	 * @return
	 */
	public static boolean SendMail(String mailName, String subjectName,
			String[] recipient, String content, String send, String mailFrom,
			String pwd) {

		String subject = subjectName;
		String smtpServer = "smtp.qiye.163.com";
		String filename = mailName;
		boolean check = true;
		Properties props = new Properties();

		props.put("mail.smtp.host", smtpServer);// 存取发送邮件服务器的信息
		props.put("mail.smtp.auth", "true");// 通过验证
		
		MyAuthenticator myauth = new MyAuthenticator("nicole@selleckchemicals.com", "Abc780713!");
	    Session session = Session.getDefaultInstance(props, myauth);
		
		//Session session = Session.getInstance(props);// 建立一个邮件会话
		session.setDebug(false);
		MimeMessage message = new MimeMessage(session);// 设置邮件
		try {
			InternetAddress fromAddress = new InternetAddress("nicole@selleckchemicals.com");
			message.setFrom(fromAddress);

			// InternetAddress[] sendTo = new
			// InternetAddress[recipient.length];// 发多人邮件
			// for (int i = 0; i < recipient.length; i++) {
			// System.out.println("发送到:" + recipient[i]);
			// sendTo[i] = new InternetAddress(recipient[i]);
			// }

			for(String receiver:recipient){
				InternetAddress toAddress = new InternetAddress(receiver);
				message.addRecipient(Message.RecipientType.TO, toAddress);
			}
			message.setSubject(subject, "utf-8");// 设置主题
			message.setSentDate(new Date());// 设置发送时间
			Multipart mm = new MimeMultipart();// 用于存放mimebodypart对象中
			BodyPart mbp = new MimeBodyPart();// 新建一个存放邮件内容的bodypart对象
			//mbp.setText(content);
			mbp.setContent(content, "text/html;charset = utf-8");
			mm.addBodyPart(mbp);

			if (mailName != null && !mailName.equals("")) {
				BodyPart mbp1 = new MimeBodyPart();// 添加一个附件
				FileDataSource fds = new FileDataSource(filename);
				DataHandler dh = new DataHandler(fds);
				mbp1.setFileName(dh.getName());
				mbp1.setDataHandler(dh);
				mm.addBodyPart(mbp1);
			}
			//message.setContent(mm, "text/html;charset = utf-8");
            message.setContent(mm);
			message.saveChanges();
			Transport transport = session.getTransport("smtp");

			transport.connect(smtpServer, "nicole@selleckchemicals.com", "Abc780713!");// 发送人的验证
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();

			// File f=new File(filename);
			// f.delete();
		} catch (Exception e) {
			check = false;
			e.printStackTrace();
		}
		return check;
	}
    
    /**
     * 发送邮件（不带附件）
     * 
     * @param mailName
     *            附件地址
     * @param subjectName
     *            主题
     * @param recipients
     *            收件人的地址
     * @param content
     *            邮件正文
     * @param send
     *            //发件人邮箱
     * @param mailFrom
     *            用户名
     * @param pwd
     *            密码
     * @return
     */
    public static boolean commonSendMail(String mailName, String subjectName,
	    String recipient, String content, String send, String mailFrom,
	    String pwd) {
		String subject = subjectName;
		String smtpServer = "smtp.gmail.com";
		String filename = mailName;

		boolean check = true;
		Properties props = new Properties();
		if (smtpServer.indexOf("smtp.gmail.com") >= 0) {
			props.setProperty("mail.smtp.socketFactory.class",
				"javax.net.ssl.SSLSocketFactory");
			props.setProperty("mail.smtp.socketFactory.fallback", "false");
			props.setProperty("mail.smtp.port", "465");
			props.setProperty("mail.smtp.socketFactory.port", "465");
		}

		props.put("mail.smtp.host", smtpServer);// 存取发送邮件服务器的信息
		props.put("mail.smtp.auth", "true");// 通过验证
		Session session = Session.getInstance(props);// 建立一个邮件会话
		session.setDebug(false);
		MimeMessage message = new MimeMessage(session);// 设置邮件
		try {
			InternetAddress fromAddress = new InternetAddress(send);
			message.setFrom(fromAddress);

			// InternetAddress[] sendTo = new
			// InternetAddress[recipient.length];// 发多人邮件
			// for (int i = 0; i < recipient.length; i++) {
			// System.out.println("发送到:" + recipient[i]);
			// sendTo[i] = new InternetAddress(recipient[i]);
			// }

			InternetAddress toAddress = new InternetAddress(recipient);
			message.setRecipient(Message.RecipientType.TO, toAddress);

			message.setSubject(subject, "utf-8");// 设置主题
			message.setSentDate(new Date());// 设置发送时间
			Multipart mm = new MimeMultipart();// 用于存放mimebodypart对象中
			BodyPart mbp = new MimeBodyPart();// 新建一个存放邮件内容的bodypart对象
			mbp.setText(content);
			mbp.setContent(content, "text/html;charset = utf-8");
			mm.addBodyPart(mbp);

			if (mailName != null && !mailName.equals("")) {
			BodyPart mbp1 = new MimeBodyPart();// 添加一个附件
			FileDataSource fds = new FileDataSource(filename);
			DataHandler dh = new DataHandler(fds);
			mbp1.setFileName(dh.getName());
			mbp1.setDataHandler(dh);
			mm.addBodyPart(mbp1);
			}
			//message.setContent(mm, "text/html;charset = utf-8");
				 message.setContent(mm);
			message.saveChanges();
			Transport transport = session.getTransport("smtp");

			transport.connect(smtpServer, mailFrom, pwd);// 发送人的验证
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();

			// File f=new File(filename);
			// f.delete();
		} catch (Exception e) {
			check = false;
			e.printStackTrace();
		}
		return check;
    }

    
    /**
     * 发送邮件（带附件）
     * 
     * @param part
     *            附件
     * @param subjectName
     *            主题
     * @param recipients
     *            收件人的地址
     * @param content
     *            邮件正文
     * @param send
     *            发件人邮箱
     * @param mailFrom
     *            用户名
     * @param pwd
     *            密码
     * @return
     */
    public static boolean multipartSendMail(List<Object[]> part,
	    String subjectName, String recipient, String content, String send,
	    String mailFrom, String pwd) {
		try {
			Properties props = new Properties();
			props.put("mail.smtp.host", "smtp.gmail.com");// 发件人使用发邮件的电子信箱服务器
			props.put("mail.smtp.auth", "true");
			Session session = Session.getInstance(props);
			session.setDebug(true);

			String smtpServer = "smtp.gmail.com";
			if (smtpServer.indexOf("smtp.gmail.com") >= 0) {
			props.setProperty("mail.smtp.socketFactory.class",
				"javax.net.ssl.SSLSocketFactory");
			props.setProperty("mail.smtp.socketFactory.fallback", "false");
			props.setProperty("mail.smtp.port", "465");
			props.setProperty("mail.smtp.socketFactory.port", "465");
			}

			MimeMessage message = new MimeMessage(session);

			//InternetAddress from = new InternetAddress("hoosin.git@gmail.com"); 
			// InternetAddress to = new InternetAddress("hoosin.git@qq.com");//
			// tto为发邮件的目的地（收件人信箱）
			// InternetAddress to = new InternetAddress("hoosin.git@qq.com");//
			// tto为发邮件的目的地（收件人信箱）
			// InternetAddress to = new InternetAddress("hoosin.git@gmail.com");
			//InternetAddress to = new InternetAddress("hoosin.git@qq.com");
			//String ttitle = "123";
			//String tcontent = "1236156";
			
			 // 给消息对象设置发件人/收件人/主题/发信时间
			InternetAddress from = new InternetAddress(mailFrom); // 发邮件的出发地（发件人的信箱
			String title = subjectName;//标题
			String tcontent = content;//内容
			InternetAddress to = new InternetAddress(recipient);//收件人的地址
			String fromName = mailFrom;//发件人的用户名
			String fromPwd = pwd;//发件人的密码

			message.setFrom(from);
			message.setRecipient(Message.RecipientType.TO, to);
			message.setSubject(title);// title为邮件的标题
			message.setSentDate(new Date());
			BodyPart mdp = new MimeBodyPart();// 新建一个存放信件内容的BodyPart对象
			mdp.setContent(tcontent, "text/html;charset=utf-8");// 给BodyPart对象设置内容和格式/编码方式tcontent为邮件内容
			Multipart mm = new MimeMultipart();// 新建一个MimeMultipart对象用来存放BodyPart对象(事实上可以存放多个)
			mm.addBodyPart(mdp);// 将BodyPart加入到MimeMultipart对象中(可以加入多个BodyPart)
			message.setContent(mm);// 把mm作为消息对象的内容
			if(part!=null){
					try {
					OutputStream ous = null;
					for (int i = 0; i < part.size(); i++) {
						// list中放置的是object数组，数组的长度是2，第一个元素里放置的是byte数组
						// 第二个数组里放置的文件的名字
						byte by[] = (byte[]) (part.get(i)[0]);
						String byName = (String) (part.get(i)[1]);
						BodyPart mbp = new MimeBodyPart();// 添加一个附件
						File file = new File("jiafei");
						DataSource ds = new FileDataSource(file);
						ous = ds.getOutputStream();
						DataHandler dh2 = new DataHandler(ds);
						ous.write(by);
						mbp.setFileName(byName);
						mbp.setDataHandler(dh2);
						mm.addBodyPart(mbp);
					}
					if (ous != null) {
						ous.flush();
						ous.close();
					}
					} catch (Exception e) {
					e.printStackTrace();
					return false;
					}
			}
			message.saveChanges();
			Transport transport = session.getTransport("smtp");
			transport.connect(smtpServer, fromName,fromPwd);// 发邮件人帐户密码
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
    }
    
    public static void main(String[] args) {
		byte buf[] = "Da shen".getBytes();
		List<Object[]> part = new ArrayList<Object[]>();
		Object obj1[] = new Object[] { buf, "dashen.txt" };
		Object obj2[] = new Object[] { buf, "dashen.pdf" };
		Object obj3[] = new Object[] { buf, "dashen.js" };
		Object obj4[] = new Object[] { buf, "dashen.java" };
		part.add(obj1);
		part.add(obj2);
		part.add(obj3);
		part.add(obj4);
		V4SendEmail.multipartSendMail(part, "test", "156880958@qq.com",
			"It's only test!", "hoosin.git@gmail.com",
			"hoosin.git", "34120319880315");
		// V4SendEmail.commonSendMail(null,"test","273500360@qq.com","test",
		// "hoosin.git@gmail.com",
		// "hoosin.git", "34120319880315");
    }
    
	//public static void main(String[] args) {
	//    V4SendEmail vse = new V4SendEmail();
	//      vse.multipartSendMail(null, "到货通知", "273500360@qq.com",
	//	      "test","hoosin.git@gmail.com",
	//   		"hoosin.git", "34120319880315");
	//    vse.multipartSendMail(null, "到货通知", "bozhao0124@gmail.com",
	//	      "test", "info@selleckchem.com", "stock-department", "huskerluoyu888");
	//    vse.SendMail("", "到货通知", "bozhao0124@gmail.com",
	//	      "test", "info@selleckchem.com", "stock-department", "huskerluoyu888");
	//    vse.commonSendMail("d:\\test.txt", "到货通知", "bozhao0124@gmail.com",
	//	      "test", "hoosin.git@gmail.com",
	//   		"hoosin.git", "34120319880315");
	//}
    private static class MyAuthenticator extends javax.mail.Authenticator {
		private String strUser;
		private String strPwd;
		public MyAuthenticator(String user, String password) {
			this.strUser = user;
			this.strPwd = password;
		}

		protected PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(strUser, strPwd);
		}
	}
}
